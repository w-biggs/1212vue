<template>
  <div class="page-container">
    <h2 class="section-header">Metrics</h2>
    <div class="toc">
      <nuxt-link to="/metrics/coach-elo" class="toc-item">
        Coach Elo
      </nuxt-link>
      <nuxt-link to="/metrics/scorigami" class="toc-item">
        Scorigami
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: `Metrics - ${this.$store.state.misc.siteName}`,
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }

  .toc {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toc-item {
    flex: 1;
    border: 1px solid $border-color;
    text-align: center;
    height: 5rem;
    @include ms-respond(font-size,1);
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-weight: 600;
    margin: 1rem 2rem;
  }

  .toc-item:hover {
    background-color: #eee;
    text-decoration: none;
  }
</style>
