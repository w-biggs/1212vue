/* eslint-disable no-param-reassign */
export const mutations = {
  setMetrics(state, metrics) {
    state.metrics = metrics;
  },
  setRanges(state, ranges) {
    state.ranges = ranges;
  },
};

export const actions = {
  async get({ commit }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const response = await this.$axios.$get(`${apiLink}/coachmetrics/`);
    const rawMetrics = response.coaches;

    const filteredMetrics = rawMetrics.filter(coach => coach.weeks.length > 0);

    const metrics = filteredMetrics.map((coach) => {
      const latestWeek = coach.weeks[coach.weeks.length - 1];
      const latestGame = latestWeek.games[latestWeek.games.length - 1];
      const { weekNo } = latestWeek.week;
      const eloChange = latestGame.elo.elo - latestGame.elo.oldElo;

      let wins = 0;
      let losses = 0;
      let ties = 0;

      let subWins = 0;
      let subLosses = 0;
      let subTies = 0;

      for (let i = 0; i < coach.weeks.length; i += 1) {
        const week = coach.weeks[i];
        for (let j = 0; j < week.games.length; j += 1) {
          const { game } = week.games[j];
          const isHome = typeof game.homeTeam.coaches.find(
            teamCoach => teamCoach.coach.username === coach.coach.username,
          ) !== 'undefined';

          let isSub = false;
          if (isHome) {
            const coachPlays = game.homeTeam.coaches.find(
              teamCoach => teamCoach.coach.username === coach.coach.username,
            ).plays;
            const maxPlays = Math.max(...game.homeTeam.coaches.map(teamCoach => teamCoach.plays));
            isSub = coachPlays !== maxPlays;
          } else {
            const coachPlays = game.awayTeam.coaches.find(
              teamCoach => teamCoach.coach.username === coach.coach.username,
            ).plays;
            const maxPlays = Math.max(...game.awayTeam.coaches.map(teamCoach => teamCoach.plays));
            isSub = coachPlays !== maxPlays;
          }

          const homeMargin = game.homeTeam.stats.score.final - game.awayTeam.stats.score.final;
          if (homeMargin === 0) {
            subTies += 1;
            if (!isSub) {
              ties += 1;
            }
          } else if (isHome === (homeMargin > 0)) {
            subWins += 1;
            if (!isSub) {
              wins += 1;
            }
          } else {
            subLosses += 1;
            if (!isSub) {
              losses += 1;
            }
          }
        }
      }

      return {
        username: coach.coach.username,
        elo: latestGame.elo.elo,
        record: {
          wins,
          losses,
          ties,
        },
        subRecord: {
          wins: subWins,
          losses: subLosses,
          ties: subTies,
        },
        eloChange,
        weekNo,
        weeks: coach.weeks,
      };
    });

    const sortedMetrics = metrics.sort((b, a) => a.elo - b.elo);

    console.log('got coach metrics');
    await commit('setMetrics', sortedMetrics.filter(team => team.conf !== null));
    await commit('setRanges', response.ranges);
  },
};

export const getters = {
  metrics: state => state.metrics,
  ranges: state => state.ranges,
};

export const state = () => ({
  metrics: [],
  ranges: [],
});
