/**
 * Generates the Coach Elo chart
 */

/**
 * Generate the coach Elo series for the chart.
 * @param {Object} coach The coach's info.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generateCoachSeries = function generateCoachSeries(coach, ranges) {
  const rangeData = ranges.map(week => [week.min, week.max]);

  const teamSeries = [];

  for (let i = 0; i < ranges.length; i += 1) {
    const weekRanges = ranges[i];

    let elo = false;

    for (let j = 0; j < coach.weeks.length; j += 1) {
      const week = coach.weeks[j];
      if (week.week.weekNo === weekRanges.weekNo
        && week.week.season.seasonNo === weekRanges.seasonNo) {
        ({ elo } = week.games[week.games.length - 1]);
        break;
      }
    }

    teamSeries.push({
      name: `Season ${weekRanges.seasonNo} Week ${weekRanges.weekNo}`,
      y: elo ? elo.elo : null,
    });
  }

  for (let i = 0; i < teamSeries.length; i += 1) {
    const point = teamSeries[i];
    if (point.y !== null
      && (i === 0 || teamSeries[i - 1].y === null)
      && (i === teamSeries.length - 1 || teamSeries[i + 1].y === null)) {
      point.marker = {
        enabled: true,
      };
    }
  }

  return [{
    Name: 'Elo',
    data: teamSeries,
    zIndex: 6,
    lineWidth: 3,
    color: 'black',
    connectNulls: false,
    states: {
      hover: {
        lineWidthPlus: 0,
      },
    },
    marker: {
      enabled: false,
      fillColor: 'black',
      radius: 3,
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
    id: 'coach',
  }, {
    name: 'Ranges',
    data: rangeData,
    type: 'arearange',
    lineWidth: 0,
    linkedTo: 'coach',
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
  }];
};

/**
 * Generate the plotlines for the chart.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generatePlotLines = function generatePlotLines(ranges) {
  const plotLines = [];

  let season = 0;
  for (let i = 0; i < ranges.length; i += 1) {
    const week = ranges[i];
    if (week.seasonNo !== season) {
      const pointStart = i;

      plotLines.push({
        color: '#d1d1d1',
        width: 1,
        value: pointStart,
        label: {
          text: `Season ${week.seasonNo}`,
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

      season = week.seasonNo;
    }
  }

  return plotLines;
};

/**
 * Generate the game string for a game on the chart.
 * @param {Object} coach The coach's info.
 * @param {Object} point The game's chartpoint.
 */
const generateGameString = function generateGameString(coach, point, ranges) {
  const { index } = point;

  const { weekNo, seasonNo } = ranges[index];

  const week = coach.weeks.find(
    coachWeek => coachWeek.week.weekNo === weekNo && coachWeek.week.season.seasonNo === seasonNo,
  );

  if (week.games.length > 1) {
    return `${week.games.length} Games`;
  }

  const { game } = week.games[0];

  const isHome = typeof game.homeTeam.coaches.find(
    teamCoach => teamCoach.coach.username === coach.username,
  ) !== 'undefined';

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

  const teamName = thisTeam.team.abbreviation;
  const oppName = oppTeam.team.abbreviation;

  const resultString = `${teamName} ${gameResult} ${teamScore}-${oppScore} vs. ${oppName}`;

  return `${resultString}`;
};

/**
 * Generate the game string for a game on the chart.
 * @param {Object} coach The coach's info.
 * @param {Array<Object>} ranges The Elo ranges for each season.
 */
const generateChartOptions = function generateChartOptions(coach, ranges) {
  const coachSeries = generateCoachSeries(coach, ranges);
  const plotLines = generatePlotLines(ranges);
  return {
    title: {
      text: `${coach.username} Elo history`,
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
        const game = generateGameString(coach, this.point, ranges);
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
    series: coachSeries,
  };
};

module.exports = generateChartOptions;
