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
              :style="isBlack(xIndex, yIndex) ? '' : `background-color: hsl(${calcGradient(getValue(xIndex, yIndex)).join(',')})`">
              {{ getValue(xIndex, yIndex) }}
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
    getValue(xIndex, yIndex) {
      if (this.scorigami.grid[xIndex]) {
        return this.scorigami.grid[xIndex][yIndex];
      }
      return null;
    },
    isBlack(xIndex, yIndex) {
      return (yIndex > xIndex) || (yIndex === 1) || (xIndex === 1);
    },
    calcGradient(value) {
      if (!value) {
        return [0, '0%', '100%'];
      }
      const hue = 240 - ((value / this.scorigami.maxVal) * 240);
      return [hue, '50%', '50%'];
    },
  },
  computed: {
    scorigami() {
      return this.$store.state.scorigami.scorigami;
    },
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

    td, th {
      width: 2em;
      text-align: center;
      background-color: #fff;
    }

    .black {
      background-color: black;
    }

    tr:first-child th {
      position: sticky;
      top: 0;
    }

    th:first-child {
      position: sticky;
      left: 0;
    }
  }
</style>
