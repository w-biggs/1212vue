<template>
  <div ref="lazyImg" :class="['lazy-img', divClass]" :data-bg="img" />
</template>


<script>
export default {
  props: {
    divClass: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.$lazyLoad(this.$refs.lazyImg);
  },
};
</script>
