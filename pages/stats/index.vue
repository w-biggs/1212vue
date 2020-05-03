<template>
  <div class="page-container">
    <h2 class="section-header">Stats</h2>
    <StatsTable :stats="stats" />
  </div>
</template>

<script>
import StatsTable from '~/components/StatsTable.vue';

export default {
  components: {
    StatsTable,
  },
  async asyncData({
    $axios, store, params, isDev,
  }) {
    const { season } = params;
    const apiLink = isDev ? 'http://localhost:12121' : 'https://api.1212.one';
    const stats = await $axios.$get(`${apiLink}/stats/${season || store.state.games.current.season}`);
    return {
      stats,
    };
  },
  data() {
    return {
      stats: [],
    };
  },
  head() {
    return {
      title: `Stats - ${this.$store.state.misc.siteName}`,
    };
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }
</style>
