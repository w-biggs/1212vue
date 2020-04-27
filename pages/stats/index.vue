<template>
  <div class="page-container">
    <h2 class="section-header">Stats</h2>
    <StatsTable :stats="stats" />
  </div>
</template>

<script>
  import StatsTable from '~/components/StatsTable';

  export default {
    components: {
      StatsTable,
    },
    data() {
      return {
        stats: [],
      };
    },
    head() {
      return {
        title: `Stats - ${this.$store.state.misc.siteName}`,
      }
    },
    async asyncData({ $axios, store, params, isDev }) {
      const { season } = params;
      const apiLink = isDev ? 'http://localhost:12121' : 'https://api.1212.one';
      const stats = await $axios.$get(`${apiLink}/stats/${season ? season : store.state.games.current.season}`);
      return {
        stats,
      };
    },
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }
</style>
