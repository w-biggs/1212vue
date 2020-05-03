/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, seasons) {
    state.seasons = seasons;
  },
};

export const actions = {
  async get({ commit }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const seasons = await this.$axios.$get(`${apiLink}/seasons/`);
    await commit('set', seasons);
  },
};

export const getters = {
  seasons: (state) => state.seasons,
};

export const state = () => ({
  seasons: [],
});
