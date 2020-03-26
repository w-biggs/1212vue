<template>
  <div :class="['lazy-img', divClass]" :data-bg="img"></div>
</template>


<script>
export default {
  props: ['divClass', 'img'],
}
</script>
