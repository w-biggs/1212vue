<template>
  <header class="header">
    <nuxt-link to="/" class="header-logo">
      <img src="~/assets/images/logo.svg" alt="OneTwoOneTwo">
    </nuxt-link>
    <ul class="nav" role="navigation">
      <li class="nav-item is-disabled">
        <span>Articles</span>
      </li>
      <li v-bind:class="['nav-item', $nuxt.$route.name === 'scores-season-week' ? 'is-active' : '']">
        <nuxt-link to="/scores">
          Scores
        </nuxt-link>
      </li>
      <li class="nav-item is-disabled">
        <span>Standings</span>
      </li>
      <li class="nav-item is-disabled">
        <span>Stats</span>
      </li>
      <li class="nav-item is-disabled">
        <span>Metrics</span>
      </li>
    </ul>
  </header>
</template>

<style scoped src="~/assets/scss/components/header.scss" lang="scss" />
