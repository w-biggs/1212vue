<template>
  <div>
    <div class="chartbox-bg" @click="closeChart" />
    <div class="chartbox" role="dialog" aria-modal="true" tabindex="-1"
         :aria-label="`${team.name} Elo History`">
      <highcharts id="chart" :options="chartOptions" class="chart" />
      <a href="#" class="chartbox-close" @click="closeChart">×</a>
    </div>
  </div>
</template>

<script>
import generateChartOptions from '~/assets/js/elo-chart';

export default {
  props: {
    team: {
      type: Object,
      required: true,
    },
  },
  computed: {
    chartOptions() {
      return generateChartOptions(this.team, this.$store.state.metrics.ranges);
    },
  },
  methods: {
    closeChart(event) {
      event.preventDefault();
      this.$emit('closeChart');
    },
  },
};
</script>

<style lang="scss" scoped>
  .chartbox-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 99;
  }

  .chartbox {
    position: fixed;
    width: 90vw;
    max-width: 45rem;
    height: 90vw;
    max-height: 30rem;
    background-color: #f4f4f4;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
  }

  .chartbox-close {
    position: absolute;
    line-height: 1;
    top: .25em;
    right: .5em;
    font-size: 2em;
    color: inherit;
    text-decoration: none;

    &:hover {
      color:inherit;
      text-decoration: none;
    }
  }

  .chart {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="scss">
  @import "~assets/scss/variables";

  .highcharts-tooltip {
    text-align: center;
    z-index: 10;

    &.highcharts-tooltip-tal{
      text-align: left;
    }

    &.highcharts-tooltip-tar{
      text-align: right;
    }
  }

  .highcharts-tooltip > span::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #f4f4f4;
    z-index: -1;
  }

  .elo-tooltip-elo {
    font-family: $mono-font-family;
    font-weight: bold;
    font-size: 1.25rem;
    display: block;
  }

  .elo-tooltip-line{
    position: fixed;
    width: 2px;
    background-color: #999;
    z-index: -5;
  }
</style>
