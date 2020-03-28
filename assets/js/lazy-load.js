/**
 * Handle image lazyloading.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

const imageObserver = new IntersectionObserver((entries) => {
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (entry.isIntersecting) { // If image visible
      const image = entry.target; // Get the element
      image.style.backgroundImage = `url('${image.dataset.bg}')`;
    }
  }
});

Vue.prototype.$lazyLoad = imageElement => imageObserver.observe(imageElement);
