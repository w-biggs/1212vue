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
  async get({ commit, rootState }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const startTime = process.hrtime();
    const response = await this.$axios.$get(`${apiLink}/metrics/`);
    const rawMetrics = response.teams;
    const fetchTime = process.hrtime(startTime);
    console.log(`Metrics fetch took ${fetchTime[0]}s ${fetchTime[1] / 1e6}ms`);
    const sortedMetrics = rawMetrics.sort((b, a) => a.elo - b.elo);

    const metrics = sortedMetrics.map((team) => {
      const currentDiv = team.team.division[team.team.division.length - 1];
      const currentConf = currentDiv.conference ? currentDiv.conference.name : null;
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
        conf: currentConf,
        elo: latestWeek.elo.elo,
        color: team.team.color,
        eloChange,
        seasonNo,
        weekNo,
        seasons: team.seasons,
      };
    });

    console.log('got metrics');
    await commit('setMetrics', metrics.filter(team => team.conf !== null));
    await commit('setRanges', response.ranges);
  },
};

export const getters = {
  metrics: state => state.metrics,
};

export const state = () => ({
  metrics: [],
  ranges: [],
});
