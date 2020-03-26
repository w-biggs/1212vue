<template>
  <div class="scoreboard-container">
    <div v-bind:class="['scoreboard', overflowing ? 'is-overflowing' : '']">
      <h2 class="section-header">Scoreboard</h2>
      <div class="games" v-bind:style="{ maxHeight: collapsed ? gamesMaxHeight : 'none' }">
        <template v-for="game in games" >
          <ScoreboardGame v-bind:game="game" :key="game.gameId" />
        </template>
      </div>
      <div class="scoreboard-expand">
        <button v-bind:aria-expanded="!collapsed" v-on:click="handleScoreboardButton">
          {{ collapsed ? 'Show more' : 'Show less' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ScoreboardGame from '../components/ScoreboardGame';
import { getMaxHeight, checkShowButton } from '../assets/js/scoreboard';
import { debounce } from '../assets/js/vendor/underscore.min';

export default {
  components: {
    ScoreboardGame
  },
  props: ['games'],
  data() {
    return {
      gamesMaxHeight: 'none',
      overflowing: false,
      collapsed: true,
    };
  },
  mounted() {
    if (process.client) {
      // Set the max height of the scoreboard to two rows.
      const maxHeight = getMaxHeight();

      this.gamesMaxHeight = `${maxHeight.toFixed(2)}px`;

      // Check if button should be shown
      this.overflowing = checkShowButton(maxHeight);

      window.addEventListener('resize', () => {
        debounce(() => {
          this.overflowing = checkShowButton(maxHeight);
        }, 300);
      });
    }
  },
  methods: {
    handleScoreboardButton: function(event) {
      this.collapsed = !this.collapsed;
    },
  },
}
</script>

<style scoped src="~/assets/scss/components/scoreboard.scss" lang="scss" />
