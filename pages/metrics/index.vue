<template>
  <div class="page-container">
    <h2 class="section-header">Metrics</h2>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Elo</th>
          <th>Record (primary coach)</th>
          <th>Record (all games)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coach, index) in coachMetrics" :key="coach.username">
          <td>{{ index + 1 }}</td>
          <th>{{ coach.username }}</th>
          <td>{{ coach.elo.toFixed(2) }}</td>
          <td>{{ `${coach.record.wins}-${coach.record.losses}${coach.record.ties ? '-' + coach.record.ties : ''}` }}</td>
          <td>{{ `${coach.subRecord.wins}-${coach.subRecord.losses}${coach.subRecord.ties ? '-' + coach.subRecord.ties : ''}` }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: `Metrics - ${this.$store.state.misc.siteName}`,
    }
  },
  async asyncData({ store }) {
    await store.dispatch('coachMetrics/get');
  },
  computed: {
    coachMetrics() {
      return this.$store.state.coachMetrics.metrics;
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .table {
    width: 100%;
    overflow: hidden;

    thead th {
      font-weight: 400;
      @include ms-respond(font-size,-1);
      padding: .25rem 1rem .25rem .5rem;
      position: relative;
      vertical-align: middle;
      background-clip: padding-box;

      &:not(.no-upper) {
        text-transform: uppercase;
      }

      & > span {
        vertical-align: baseline;
      }
    }

    thead {
      border-bottom: 2px solid black;
    }

    td {
      padding: .5rem;
    }

    tbody > tr {
      border-bottom: 1px solid $border-color;
    }
  }
</style>
