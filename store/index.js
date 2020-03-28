export const state = () => ({
  test: 'test',
});

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('metrics/get');
  },
};
