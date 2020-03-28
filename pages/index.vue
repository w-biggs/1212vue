<template>
  <div class="home-container">
    <Scoreboard />
    <HomeMetrics />
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
      gameRefresh: null,
    };
  },
  mounted() {
    this.$store.dispatch('games/get');
    this.$store.dispatch('metrics/get');
    this.gameRefresh = setInterval(() => {
      this.$store.dispatch('games/get');
    }, 60000);
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.gameRefresh);
    next();
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
