/**
 * Generates the Elo chart
 */

/**
 * Calculate the pointStart for a given season.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 * @param {Number} index The season index to calculate pointStart for.
 */
const calcPointStart = function calcPointStart(ranges, index) {
  if (index > 0) {
    return ranges.slice(0, index).reduce((a, b) => a + b.weeks.length, 0) - index;
  }
  return 0;
};

/**
 * Generate the Elo range series for the chart.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generateRangeSeries = function generateRangeSeries(ranges) {
  const series = [];

  for (let i = 0; i < ranges.length; i += 1) {
    const season = ranges[i];
    const { seasonNo } = season;
    const data = season.weeks.map(week => [week.min, week.max]);

    const pointStart = calcPointStart(ranges, i);

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
};

/**
 * Generate the team Elo series for the chart.
 * @param {Object} team The team's info.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generateTeamSeries = function generateTeamSeries(team, ranges) {
  const series = [];
  const rangeSeries = generateRangeSeries(ranges);

  for (let i = 0; i < rangeSeries.length; i += 1) {
    const rangeSeason = rangeSeries[i];
    const { data: seasonRanges, seasonNo } = rangeSeason;
    const teamSeason = team.seasons.find(season => season.season.seasonNo === seasonNo);
    const seasonSeries = [];

    if (teamSeason) {
      /* Start series at offset if more than one season */
      const pointStart = calcPointStart(ranges, i);

      /* Push each week's Elo to the series */
      for (let j = 0; j < seasonRanges.length; j += 1) {
        const { weekNo } = ranges[i].weeks[j];
        const teamWeek = teamSeason.weeks.find((week) => {
          if (week.preseason) {
            return weekNo === -1;
          }
          return week.week.weekNo === weekNo;
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
        color: team.color,
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
};

/**
 * Generate the plotlines for the chart.
 * @param {Array<Object>} teamSeries The team Elo series.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generatePlotLines = function generatePlotLines(teamSeries, ranges) {
  const plotLines = [];
  const rangeSeries = teamSeries.filter(singleSeries => singleSeries.type === 'arearange');

  for (let i = 0; i < ranges.length; i += 1) {
    const season = rangeSeries.find(
      seasonSeries => seasonSeries.seasonNo === ranges[i].seasonNo,
    );
    if (season) {
      const pointStart = calcPointStart(ranges, i);

      /* Season markers */
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
  }

  return plotLines;
};

/**
 * Generate the game string for a game on the chart.
 * @param {Object} team The team's info.
 * @param {Object} point The game's chartpoint.
 */
const generateGameString = function generateGameString(team, point) {
  const { index } = point;
  const { seasonNo } = point.series.options;

  /* Index 0 is start of season */
  if (index === 0) {
    return false;
  }

  /* In season 1, index 1 = week 0, etc. */
  const weekNo = (seasonNo === 1) ? index - 1 : index;

  let wins = 0;
  let losses = 0;
  let ties = 0;

  const season = team.seasons.find(teamSeason => teamSeason.season.seasonNo === seasonNo);

  season.weeks.forEach((week) => {
    if (week.week && (week.week.weekNo <= weekNo)) {
      const isHome = week.game.homeTeam.team.name === team.name;

      const homeScore = week.game.homeTeam.stats.score.final;
      const awayScore = week.game.awayTeam.stats.score.final;
      const homeMargin = homeScore - awayScore;

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
    const isHome = game.homeTeam.team.name === team.name;
    const thisTeam = isHome ? game.homeTeam : game.awayTeam;
    const oppTeam = isHome ? game.awayTeam : game.homeTeam;
    const teamScore = thisTeam.stats.score.final;
    const oppScore = oppTeam.stats.score.final;

    let gameResult = 'T';
    if (teamScore > oppScore) {
      gameResult = 'W';
    } else if (teamScore < oppScore) {
      gameResult = 'L';
    }

    const oppName = oppTeam.team.name;

    const resultString = `${gameResult} ${teamScore}-${oppScore} vs. ${oppName}`;

    const recordString = `${wins}-${losses}${ties ? `-${ties}` : ''}`;

    return `${resultString} | ${recordString}`;
  }
  return '';
};

/**
 * Generate the game string for a game on the chart.
 * @param {Object} team The team's info.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generateChartOptions = function generateChartOptions(team, ranges) {
  const teamSeries = generateTeamSeries(team, ranges);
  const plotLines = generatePlotLines(teamSeries, ranges);
  return {
    title: {
      text: `${team.name} Elo history`,
    },
    chart: {
      backgroundColor: '#f4f4f4',
      style: {
        fontFamily: '"HK Grotesk", "Helvetica Neue", Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif',
      },
      displayErrors: true,
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
        const game = generateGameString(team, this.point);
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
    series: teamSeries,
  };
};

module.exports = generateChartOptions;
