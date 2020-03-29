/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, games) {
    state.games = games;
  },
};

export const actions = {
  async get({ commit, getters }) {
    const { current } = getters;
    const { games } = await this.$axios.$get(`http://localhost:12121/games/${current.season}/${current.week}/`);
    console.log('got games');
    await commit('set', games);
  },
};

export const getters = {
  games: state => state.games,
  current: state => state.current,
};

export const state = () => ({
  games: [{
    homeTeam: {
      team: {
        name: 'Loading...',
      },
      stats: {
        score: {
          final: '--',
        },
      },
    },
    awayTeam: {
      team: {
        name: 'Loading...',
      },
      stats: {
        score: {
          final: '--',
        },
      },
    },
    live: false,
  }],
  current: {
    season: 3,
    week: 1,
  },
});