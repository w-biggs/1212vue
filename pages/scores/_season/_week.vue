<template>
  <div class="page-container">
    <h2 class="section-header">Scores</h2>
    <div class="games">
      <template v-for="game in games" >
        <ScoresGame v-bind:game="game" :key="game.gameId" />
      </template>
    </div>
  </div>
</template>

<script>
import ScoresGame from '~/components/ScoresGame';

export default {
  components: {
    ScoresGame
  },
  validate({ params }) {
    if (!/^\d+$/.test(params.season) || !/^\d+$/.test(params.week)) {
      return false;
    }
    return true;
  },
  data() {
    return {
      games: [{
        homeTeam: {
          team: {
            name: 'Loading...',
          },
          stats: {
            score: {
              quarters: [],
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
              quarters: [],
              final: '--',
            },
          },
        },
        live: false,
      }],
      isDev: false,
      season: 1,
      week: 1,
    };
  },
  asyncData({ $axios, isDev, params }) {
    const { season, week } = params;
    const apiLink = isDev ? 'http://localhost:12121' : 'https://api.1212.one';
    return $axios.$get(`${apiLink}/games/${season}/${week}/`)
      .then((response) => {
        if (response.games) {
          return {
            games: response.games,
            isDev,
            season,
            week,
          };
        }
        return false;
      });
  },
  mounted() {
    if (process.client) {
      const apiLink = this.isDev ? 'http://localhost:12121' : 'https://api.1212.one';
      setInterval(function() {
        return this.$axios.$get(`${apiLink}/games/${this.season}/${this.week}/`)
          .then((response) => {
            if (response.games) {
              console.log('fetched games');
              this.games = response.games;
            }
          })
          .catch(console.error);
      }.bind(this), 60000);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }

  .games {
    display: flex;
    padding: $pad 0;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-around;
  }
</style>
