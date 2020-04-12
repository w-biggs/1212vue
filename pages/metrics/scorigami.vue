<template>
  <div class="page-container">
    <h2 class="section-header">Scorigami</h2>
    <div class="score-table-container">
      <table class="score-table">
        <tbody>
          <tr>
            <th></th>
            <th scope="col" v-for="(n, xIndex) in (scorigami.maxWin + 1)" :key="`0-${xIndex}`">{{ xIndex }}</th>
          </tr>
          <tr v-for="(n, yIndex) in (scorigami.maxLoss + 1)" :key="`${yIndex}-0`">
            <th>{{ yIndex }}</th>
            <td scope="col" v-for="(n, xIndex) in (scorigami.maxWin + 1)" :key="`${yIndex}-${xIndex}`"
              :class="isBlack(xIndex, yIndex) ? 'black' : ''"
              :style="isBlack(xIndex, yIndex) || !scorigami.grid[xIndex][yIndex] ? '' : `background-color: hsl(${calcGradient(scorigami.grid[xIndex][yIndex]).join(',')})`">
              {{ scorigami.grid[xIndex][yIndex] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: `Scorigami - ${this.$store.state.misc.siteName}`,
    }
  },
  async asyncData({ store }) {
    await store.dispatch('scorigami/get');
  },
  methods: {
    isBlack(xIndex, yIndex) {
      return (yIndex > xIndex) || (yIndex === 1) || (xIndex === 1);
    },
    calcGradient(value) {
      const hue = 240 - ((value / this.scorigami.maxVal) * 240);
      return [hue, '50%', '50%'];
    },
  },
  created() {
    // Make it non-reactive since it won't update while we're looking at it
    this.scorigami = {...this.$store.state.scorigami.scorigami};
  },
}
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }

  .score-table-container {
    width: 100%;
    height: 80vh;
    overflow: auto;
  }

  .score-table {
    font-size: 11px;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    position: relative;

    tr:not(:first-child):hover > td:not(.black),
    tr:not(:first-child):hover > th:not(.black) {
      background-color: #e7e7e7;
    }

    td, th {
      width: 2em;
      text-align: center;
      position: relative;
    }

    td:hover::after {
      content: "";
      position: absolute;
      background-color: #e7e7e7;
      left: 0;
      top: -5000px;
      height: 10000px;
      width: 100%;
      z-index: -1;
    }

    .black {
      background-color: black;
    }

    tr:first-child th {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }

    th:first-child {
      position: sticky;
      left: 0;
      background-color: #fff;
      z-index: 1;
    }
  }
</style>
