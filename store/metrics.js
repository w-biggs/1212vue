/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, metrics) {
    state.metrics = metrics;
  },
};

export const actions = {
  async get({ commit, rootState }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const startTime = process.hrtime();
    const rawMetrics = await this.$axios.$get(`${apiLink}/metrics/`);
    const fetchTime = process.hrtime(startTime);
    console.log(`Metrics fetch took ${fetchTime[0]}s ${fetchTime[1] / 1e6}ms`);
    const sortedMetrics = rawMetrics.sort((b, a) => a.elo - b.elo);

    const metrics = sortedMetrics.map((team) => {
      const currentDiv = team.team.division[team.team.division.length - 1];
      const latestSeason = team.seasons[team.seasons.length - 1];
      const latestWeek = latestSeason.weeks[latestSeason.weeks.length - 1];
      const { seasonNo } = latestSeason.season;
      const weekNo = latestWeek.week ? latestWeek.week.weekNo : -1;
      const eloChange = (rootState.games.current.season === seasonNo
        && rootState.games.current.week === weekNo)
        ? latestWeek.elo.elo - latestWeek.elo.oldElo
        : false;
      return {
        name: team.team.name,
        abbreviation: team.team.abbreviation,
        div: currentDiv.name,
        conf: currentDiv.conference.name,
        elo: latestWeek.elo.elo,
        eloChange,
        seasonNo,
        weekNo,
      };
    });

    console.log('got metrics');
    await commit('set', metrics);
  },
};

export const getters = {
  metrics: state => state.metrics,
  test: state => state.test,
};

export const state = () => ({
  metrics: [],
});
