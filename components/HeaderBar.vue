<template>
  <header :class="['header', navIsOpen ? 'is-open-nav' : '']">
    <nuxt-link to="/" class="header-logo">
      <img :src="require(`../assets/images/${siteLogo}`)" :alt="siteName" :data-url="siteLogo">
    </nuxt-link>
    <ul class="nav" role="navigation">
      <li class="nav-item">
        <a href="https://fcfbovertime.wordpress.com">Articles</a>
      </li>
      <li :class="[
        'nav-item',
        ['scores-season-week', 'scores-season-week-conf'].indexOf($nuxt.$route.name) >= 0
          ? 'is-active'
          : ''
      ]">
        <nuxt-link to="/scores">
          Scores
        </nuxt-link>
      </li>
      <li :class="['nav-item', $nuxt.$route.name === 'standings' ? 'is-active' : '']">
        <nuxt-link to="/standings">
          Standings
        </nuxt-link>
      </li>
      <li :class="['nav-item', $nuxt.$route.name === 'stats' ? 'is-active' : '']">
        <nuxt-link to="/stats">
          Stats
        </nuxt-link>
      </li>
      <li :class="['nav-item', $nuxt.$route.name === 'metrics' ? 'is-active' : '']">
        <nuxt-link to="/metrics">
          Metrics
        </nuxt-link>
      </li>
    </ul>
    <button class="nav-expand" :aria-expanded="navIsOpen" @click="toggleNav">
      Menu
    </button>
  </header>
</template>

<script>
export default {
  data() {
    return {
      siteName: 'OneTwoOneTwo',
      siteLogo: 'logo.svg',
      navIsOpen: false,
    };
  },
  serverPrefetch() {
    this.siteName = this.$store.state.misc.siteName;
    this.siteLogo = this.$store.state.misc.siteLogo;
  },
  watch: {
    $route() {
      if (this.navIsOpen) {
        this.navIsOpen = !this.navIsOpen;
      }
    },
  },
  methods: {
    toggleNav() {
      this.navIsOpen = !this.navIsOpen;
    },
  },
};
</script>

<style scoped src="~/assets/scss/components/header.scss" lang="scss" />
