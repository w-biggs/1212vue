<template>
  <div class="home-container">
    <Scoreboard v-bind:games="games" />
    <HomeMetrics v-bind:metrics="metrics" />
  </div>
</template>

<script>
import Scoreboard from '../components/Scoreboard';
import HomeMetrics from '../components/HomeMetrics';

export default {
  components: {
    Scoreboard,
    HomeMetrics,
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
      isDev: false,
      metrics: [],
    };
  },
  async asyncData({ $axios, isDev }) {
    const returnData = {
      isDev,
    };
    const apiLink = isDev ? 'http://localhost:12121' : 'https://api.1212.one';
    const games = await $axios.$get(`${apiLink}/games/3/1/`);
    if (games.games) {
      returnData.games = games.games;
    }
    const metrics = await $axios.$get(`${apiLink}/metrics/`);
    const sortedMetrics = metrics.sort((b, a) => a.elo - b.elo);
    returnData.metrics = sortedMetrics;
    return returnData;
  },
  mounted() {
    if (process.client) {
      const apiLink = this.isDev ? 'http://localhost:12121' : 'https://api.1212.one';
      setInterval(function() {
        return this.$axios.$get(`${apiLink}/games/3/1/`)
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

  .home-container {
    grid-template-columns: 1fr;
    grid-template-rows: $header-height auto auto auto $footer-height;
    grid-template-areas:
      "header"
      "scboard"
      "listing"
      "elo"
      "footer";
  }

  @media screen and (min-width: $breakpoint-md){
    .home-container {
      grid-template-columns: 1fr 1fr 1fr 15rem;
      grid-template-rows: $header-height auto auto $footer-height;
      grid-template-areas:
        "header header header header"
        "scboard scboard scboard scboard"
        "elo elo elo listing"
        "footer footer footer footer";
    }
  }
</style>
