/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, isAF) {
    if (isAF) {
      state.siteLogo = '462.svg';
    } else {
      state.siteLogo = 'logo.svg';
    }
  },
};

export const actions = {
  async get({ commit }) {
    const date = new Date();
    const isAF = ((date.getMonth() + 1) === 4 && date.getDate() === 1);
    await commit('set', isAF);
  },
};

export const getters = {
  siteName: (state) => state.siteName,
  siteLogo: (state) => state.siteLogo,
};

export const state = () => ({
  siteName: 'OneTwoOneTwo',
  siteLogo: 'logo.svg',
});
