<template>
  <div :class="['lazy-img', divClass]" :data-bg="img" ref="lazyImg"></div>
</template>


<script>
export default {
  props: ['divClass', 'img'],
  mounted() {
    this.$lazyLoad(this.$refs.lazyImg);
  }
}
</script>
