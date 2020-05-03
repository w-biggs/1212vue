/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, stats) {
    state.stats = stats;
  },
};

export const actions = {
  async get({ commit, rootState }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const teams = await this.$axios.$get(`${apiLink}/stats/${rootState.games.current.season}`);
    await commit('set', teams);
  },
};

export const getters = {
  stats: (state) => state.stats,
};

export const state = () => ({
  stats: [],
});
