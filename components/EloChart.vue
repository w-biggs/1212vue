<template>
  <div>
    <div class="chartbox-bg" v-on:click="closeChart"></div>
    <div class="chartbox" role="dialog" aria-modal="true" tabindex="-1" :aria-label="`${team.name} Elo History`">
      <highcharts :options="chartOptions" class="chart" id="chart"></highcharts>
      <a href="#" class="chartbox-close" v-on:click="closeChart">×</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['team'],
  methods: {
    closeChart(event) {
      event.preventDefault();
      this.$emit('closeChart');
    },
  },
  computed: {
    rangeSeries() {
      const { ranges } = this.$store.state.metrics;
      const series = [];
      for (let i = 0; i < ranges.length; i += 1) {
        const season = ranges[i];
        const { seasonNo } = season;
        const data = season.weeks.map(week => [week.min, week.max]);

        /* Start series at offset if more than one season */
        let pointStart = 0;
        if (i > 0) {
          pointStart = ranges.slice(0, i).reduce((a, b) => a + b.weeks.length, 0) - 1;
        }

        series[i] = {
          name: `Season ${seasonNo} Ranges`,
          data,
          seasonNo,
          type: 'arearange',
          lineWidth: 0,
          linkedTo: 'S1',
          fillOpacity: 0.05,
          zIndex: 0,
          color: 'black',
          marker: {
            enabled: false,
          },
          states: {
            inactive: {
              opacity: 1,
            },
          },
          enableMouseTracking: false,
          pointStart,
        };
      }
      return series;
    },
    teamSeries() {
      const series = [];
      const rangeSeries = this.rangeSeries;
      const { ranges } = this.$store.state.metrics;

      for (let i = 0; i < rangeSeries.length; i += 1) {
        const rangeSeason = rangeSeries[i];
        const { data: seasonRanges, seasonNo } = rangeSeason;
        const teamSeason = this.team.seasons.find(season => season.season.seasonNo === seasonNo);
        const seasonSeries = [];

        if (teamSeason) {
          /* Start series at offset if more than one season */
          let pointStart = 0;
          if (i > 0) {
            pointStart = ranges.slice(0, i).reduce((a, b) => a + b.weeks.length, 0) - 1;
          }

          /* Push each week's Elo to the series */
          for (let j = 0; j < seasonRanges.length; j += 1) {
            const { weekNo } = ranges[i].weeks[j];
            const teamWeek = teamSeason.weeks.find((week) => {
              if (week.preseason) {
                return weekNo === -1;
              } else {
                return week.week.weekNo === weekNo;
              }
            });

            const point = {
              name: weekNo >= 0 ? `Week ${weekNo}` : `Start of Season ${ranges[i].seasonNo}`,
              y: teamWeek ? teamWeek.elo.elo : null,
            };

            seasonSeries.push(point);
          }

          series.push({
            name: `Season ${seasonNo} Elo`,
            seasonNo,
            data: seasonSeries,
            zIndex: 6,
            lineWidth: 3,
            color: this.team.color,
            connectNulls: true,
            states: {
              hover: {
                lineWidthPlus: 0,
              },
            },
            marker: {
              enabled: false,
              fillColor: '#999',
              radius: 4,
              symbol: 'circle',
              states: {
                hover: {
                  enabled: true,
                  lineWidth: 0,
                  lineWidthPlus: 0,
                  radiusPlus: 0,
                },
              },
            },
            id: `S${seasonNo}`,
            linkedTo: `S${(seasonNo % (rangeSeries.length)) + 1}`,
            showInLegend: (seasonNo === 1),
            pointStart,
          });
          series.push(rangeSeason);
        }
      }
      return series;
    },
    plotLines() {
      const series = this.teamSeries;
      const plotLines = [];
      const { ranges } = this.$store.state.metrics;
      const rangeSeries = series.filter(singleSeries => singleSeries.type === 'arearange');
      for (let i = 0; i < rangeSeries.length; i += 1) {
        const season = rangeSeries[i];
        /* Season markers */
        let pointStart = 0;
        if (season.seasonNo > 1) {
          pointStart = ranges.slice(0, i).reduce((a, b) => a + b.weeks.length, 0) - 1;
        }
        plotLines.push({
          color: '#d1d1d1',
          width: 1,
          value: pointStart,
          label: {
            text: `Season ${season.seasonNo}`,
            align: 'right',
            verticalAlign: 'bottom',
            textAlign: 'right',
            style: {
              color: 'rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              fontSize: '1.25em',
            },
            y: -20,
          },
          zIndex: 3,
        });

        /* Playoff markers */
        let playoffStartWeek = 13 + pointStart;
        if (season.seasonNo === 1) {
          playoffStartWeek = 14 + pointStart;
        }
        plotLines.push({
          color: '#f4f4f4',
          width: 2,
          value: playoffStartWeek + 0.5,
          label: {
            text: 'PLAYOFFS',
            verticalAlign: 'middle',
            textAlign: 'center',
            style: {
              color: 'rgba(0,0,0,0.5)',
              fontWeight: 'bold',
            },
            y: 50,
          },
          zIndex: 5,
        });
      }

      return plotLines;
    },
    chartOptions() {
      const gameString = function gameString(team, point) {
        const { index } = point;
        const { seasonNo } = point.series.options;

        /* Index 0 is start of season */
        if (index === 0) {
          return false;
        }

        let weekNo = index;

        /* In season 1, index 1 = week 0, etc. */
        if (seasonNo === 1) {
          weekNo = index - 1;
        }

        let wins = 0;
        let losses = 0;
        let ties = 0;

        const season = this.team.seasons.find(teamSeason => teamSeason.season.seasonNo === seasonNo);
        // console.log(season);

        season.weeks.forEach((week) => {
          if (week.week && (week.week.weekNo <= weekNo)) {
            const isHome = week.game.homeTeam.team.name === this.team.name;
            const homeMargin = week.game.homeTeam.stats.score.final - week.game.awayTeam.stats.score.final;
            if (homeMargin === 0) {
              ties += 1;
            } else if (isHome === (homeMargin > 0)) {
              wins += 1;
            } else {
              losses += 1;
            }
          }
        });

        const { game } = season.weeks.find(week => week.week && (week.week.weekNo === weekNo));

        if (game) {
          const isHome = game.homeTeam.team.name === this.team.name;
          const thisTeam = isHome ? game.homeTeam : game.awayTeam;
          const oppTeam = isHome ? game.awayTeam : game.homeTeam;
          const teamScore = thisTeam.stats.score.final;
          const oppScore = oppTeam.stats.score.final;
          const gameResult = teamScore > oppScore ? 'W' : (teamScore < oppScore ? 'L' : 'T');
          const oppName = oppTeam.team.name;

          const resultString = `${gameResult} ${teamScore}-${oppScore} vs. ${oppName}`;

          const recordString = `${wins}-${losses}${ties ? `-${ties}` : ''}`;

          return `${resultString} | ${recordString}`;
        }
        return '';
      }.bind(this);
      const plotLines = this.plotLines;
      const series = this.teamSeries;
      const team = this.team;
      return {
        title: {
          text: `${team.name} Elo history`,
        },
        chart: {
          backgroundColor: '#f4f4f4',
          style: {
            fontFamily: '"HK Grotesk", "Helvetica Neue", Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif',
          },
        },
        xAxis: {
          title: {
            text: 'Week',
            enabled: false,
          },
          labels: {
            enabled: false,
          },
          minorTickLength: 0,
          tickLength: 0,
          plotLines,
        },
        yAxis: {
          title: {
            text: 'Elo rating',
            enabled: false,
          },
          max: 1900,
          min: 1100,
        },
        tooltip: {
          borderWidth: 0,
          shape: 'square',
          animation: false,
          backgroundColor: 'rgba(0,0,0,0)',
          shadow: false,
          useHTML: true,
          padding: 0,
          formatter: function formatTooltip() {
            const { chart } = this.series;
            const game = gameString(team, this.point);
            const gameInfoString = game ? `<div class="elo-tooltip-game">${game}</div>` : '';
            const lineTop = chart.plotTop + 16;
            const lineLeft = chart.plotLeft + this.point.plotX + 16;
            const lineBottom = (chart.plotTop + chart.plotHeight) - this.point.plotY - 16 + 4;
            return `<div class="elo-tooltip-elo">${this.y.toFixed(0)}</div>
            ${gameInfoString}
            <div class="elo-tooltip-week">${this.point.name}</div>
            <div class="elo-tooltip-line" style="top: ${lineTop}px; left: ${lineLeft}px; bottom: ${lineBottom}px"></div>`;
          },
          positioner: function positionTooltip(labelWidth, labelHeight, point) {
            let calcLeft = point.plotX + this.chart.plotLeft - (labelWidth / 2);
            const minLeft = this.chart.plotLeft;
            const maxLeft = this.chart.plotLeft + this.chart.plotWidth - labelWidth;
            const tooltipElement = document.querySelector('div.highcharts-tooltip');
            if (calcLeft < minLeft) {
              calcLeft = minLeft;
              tooltipElement.classList.remove('highcharts-tooltip-tar');
              tooltipElement.classList.add('highcharts-tooltip-tal');
            } else if (calcLeft > maxLeft) {
              calcLeft = maxLeft;
              tooltipElement.classList.remove('highcharts-tooltip-tal');
              tooltipElement.classList.add('highcharts-tooltip-tar');
            } else {
              tooltipElement.classList.remove('highcharts-tooltip-tal');
              tooltipElement.classList.remove('highcharts-tooltip-tar');
            }
            return { x: calcLeft, y: this.chart.plotTop };
          },
        },
        legend: {
          enabled: false,
        },
        exporting: {
          accessibility: {
            enabled: true,
          },
          buttons: {
            contextButton: {
              align: 'left',
              theme: {
                fill: 'transparent',
              },
            },
          },
        },
        series,
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .chartbox-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 99;
  }

  .chartbox {
    position: fixed;
    width: 90vw;
    max-width: 45rem;
    height: 90vw;
    max-height: 30rem;
    background-color: #f4f4f4;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
  }

  .chartbox-close {
    position: absolute;
    line-height: 1;
    top: .25em;
    right: .5em;
    font-size: 2em;
    color: inherit;
    text-decoration: none;

    &:hover {
      color:inherit;
      text-decoration: none;
    }
  }

  .chart {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="scss">
  @import "~assets/scss/variables";

  .highcharts-tooltip {
    text-align: center;
    z-index: 10;

    &.highcharts-tooltip-tal{
      text-align: left;
    }

    &.highcharts-tooltip-tar{
      text-align: right;
    }
  }

  .highcharts-tooltip > span::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #f4f4f4;
    z-index: -1;
  }

  .elo-tooltip-elo {
    font-family: $mono-font-family;
    font-weight: bold;
    font-size: 1.25rem;
    display: block;
  }

  .elo-tooltip-line{
    position: fixed;
    width: 2px;
    background-color: #999;
    z-index: -5;
  }
</style>
