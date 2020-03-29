// eslint-disable-next-line import/prefer-default-export
export const actions = {
  async nuxtServerInit({ dispatch }) {
    const dispatches = [];
    dispatches.push(
      await dispatch('metrics/get'),
      await dispatch('seasons/get'),
      await dispatch('confs/get'),
    );
    await Promise.all(dispatches);
  },
};
