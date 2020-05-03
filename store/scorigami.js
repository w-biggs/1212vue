/* eslint-disable no-param-reassign */
export const mutations = {
  set(state, scorigami) {
    state.scorigami = scorigami;
  },
};

export const actions = {
  async get({ commit }) {
    const useRemote = process.browser && (process.env.NODE_ENV === 'production');
    const apiLink = useRemote ? 'https://api.1212.one' : 'http://localhost:12121';
    const games = await this.$axios.$get(`${apiLink}/games/`);


    let maxWin = 0;
    let maxLoss = 0;
    let maxVal = 0;
    const grid = [];

    for (let i = 0; i < games.length; i += 1) {
      const game = games[i];
      // Skip live games
      if (!game.live) {
        const homeScore = game.homeTeam.stats.score.final;
        const awayScore = game.awayTeam.stats.score.final;

        const winScore = Math.max(homeScore, awayScore);
        const lossScore = Math.min(homeScore, awayScore);

        maxWin = Math.max(winScore, maxWin);
        maxLoss = Math.max(lossScore, maxLoss);

        if (!grid[winScore]) {
          grid[winScore] = [];
        }

        if (grid[winScore][lossScore]) {
          grid[winScore][lossScore] += 1;
        } else {
          grid[winScore][lossScore] = 1;
        }

        maxVal = Math.max(maxVal, grid[winScore][lossScore]);
      }
    }

    for (let i = 0; i < grid.length; i += 1) {
      if (!grid[i]) {
        grid[i] = [];
      }
    }

    await commit('set', {
      maxWin,
      maxLoss,
      maxVal,
      grid,
    });
  },
};

export const getters = {
  scorigami: (state) => state.scorigami,
};

export const state = () => ({
  scorigami: {
    maxWin: 0,
    maxLoss: 0,
    maxVal: 0,
    grid: [],
  },
});
