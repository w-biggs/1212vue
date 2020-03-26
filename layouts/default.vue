<template>
  <div class="container">
    <HeaderBar />
    <nuxt />
  </div>
</template>

<script>
import HeaderBar from '../components/HeaderBar';

export default {
  components: {
    HeaderBar
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .container {
    max-width: $container-width;
    padding: .5rem;
    margin: 0 auto;
  }
</style>
