/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, confs) {
    state.confs = confs;
  },
};

export const actions = {
  async get({ commit }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const confs = await this.$axios.$get(`${apiLink}/confs/`);
    confs.sort((a, b) => a.shortName.localeCompare(b.shortName));
    await commit('set', confs);
  },
};

export const getters = {
  confs: (state) => state.confs,
};

export const state = () => ({
  confs: [],
});
