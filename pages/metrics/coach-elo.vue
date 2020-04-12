<template>
  <div class="page-container">
    <h2 class="section-header">Coach Elo</h2>
    <table class="table">
      <thead>
        <tr>
          <th colspan="3"></th>
          <th class="type" colspan="3" scope="colgroup">Primary Coach</th>
          <th class="type" colspan="3" scope="colgroup">All Games</th>
        </tr>
        <tr>
          <th class="ranking" scope="col" v-on:click="setSort(false, $event)">
            <span>#</span>
          </th>
          <th class="username" scope="col" v-on:click="setSort(false, $event)">
            <span>username</span>
            <div :class="['sorter', sorterClass('username')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="elo" scope="col" v-on:click="setSort(false, $event)">
            <span>Elo</span>
            <div :class="['sorter', sorterClass('elo')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="wins" scope="col" v-on:click="setSort(false, $event)">
            <span>W</span>
            <div :class="['sorter', sorterClass('wins')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="losses" scope="col" v-on:click="setSort(false, $event)">
            <span>L</span>
            <div :class="['sorter', sorterClass('losses')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="ties" scope="col" v-on:click="setSort(false, $event)">
            <span>T</span>
            <div :class="['sorter', sorterClass('ties')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="all-wins" scope="col" v-on:click="setSort(false, $event)">
            <span>W</span>
            <div :class="['sorter', sorterClass('all-wins')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="all-losses" scope="col" v-on:click="setSort(false, $event)">
            <span>L</span>
            <div :class="['sorter', sorterClass('all-losses')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
          <th class="all-ties" scope="col" v-on:click="setSort(false, $event)">
            <span>T</span>
            <div :class="['sorter', sorterClass('all-ties')]">
              <span class="asc">▲</span>
              <span class="desc">▼</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody ref="metricsTableBody">
        <tr v-for="(coach, index) in coachMetrics" :key="coach.username">
          <td class="ranking">{{ index + 1 }}</td>
          <th class="username" :data-value="coach.username">
            <a href="#" v-on:click="openChart(coach, $event)">
              {{ coach.username }}
            </a>
          </th>
          <td class="elo" :data-value="coach.elo" :title="coach.elo.toFixed(4)">{{ coach.elo.toFixed(2) }}</td>
          <td class="wins" :data-value="coach.record.wins">{{ coach.record.wins }}</td>
          <td class="losses" :data-value="coach.record.losses">{{ coach.record.losses }}</td>
          <td class="ties" :data-value="coach.record.ties">{{ coach.record.ties }}</td>
          <td class="all-wins" :data-value="coach.subRecord.wins">{{ coach.subRecord.wins }}</td>
          <td class="all-losses" :data-value="coach.subRecord.losses">{{ coach.subRecord.losses }}</td>
          <td class="all-ties" :data-value="coach.subRecord.ties">{{ coach.subRecord.ties }}</td>
        </tr>
      </tbody>
    </table>
    <CoachEloChart v-if="chartOpen" v-on:closeChart="closeChart" :coach="chartCoach" ref="eloChart" />
  </div>
</template>

<script>
import CoachEloChart from '~/components/CoachEloChart';

export default {
  components: {
    CoachEloChart,
  },
  data() {
    return {
      collapsed: true,
      sort: {
        by: 'elo-rating',
        asc: false,
      },
      chartOpen: false,
      chartCoach: null,
    };
  },
  head () {
    return {
      title: `Coach Elo - ${this.$store.state.misc.siteName}`,
    }
  },
  async asyncData({ store }) {
    await store.dispatch('coachMetrics/get');
  },
  methods: {
    emptyNode(node) {
      const range = document.createRange();
      range.selectNodeContents(node);
      range.deleteContents();
    },
    sortRows(rowA, rowB) {
      const cellA = rowA.getElementsByClassName(this.sort.by)[0];
      const cellB = rowB.getElementsByClassName(this.sort.by)[0];

      // Check if it's a number - if it is, sort it as a number.
      const valA = Number.isNaN(parseFloat(cellA.dataset.value))
        ? cellA.dataset.value : parseFloat(cellA.dataset.value);
      const valB = Number.isNaN(parseFloat(cellB.dataset.value))
        ? cellB.dataset.value : parseFloat(cellB.dataset.value);

      if (valA > valB) {
        return this.sort.asc ? -1 : 1;
      }
      if (valB > valA) {
        return this.sort.asc ? 1 : -1;
      }
      return 0;
    },
    sortTable() {
      const tbody = this.$refs.metricsTableBody;
      const rows = Array.from(tbody.children);

      // Sort the rows
      rows.sort(this.sortRows);

      // Delete all rows
      this.emptyNode(tbody);

      // Re-add the rows in the sorted order.
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const ranking = row.getElementsByClassName('ranking')[0];
        ranking.textContent = i + 1;
        tbody.appendChild(row);
      }
    },
    setSort(isAlpha, event) {
      const colClass = event.currentTarget.classList[0];
      if (this.sort.by === colClass) {
        this.sort.asc = !this.sort.asc;
      } else {
        this.sort.by = colClass;
        this.sort.asc = isAlpha;
      }
      this.sortTable();
    },
    sorterClass(className) {
      if (this.sort.by === className) {
        if (this.sort.asc) {
          return 'asc';
        }
        return 'desc';
      }
      return '';
    },
    openChart(coach, event) {
      event.preventDefault();
      this.chartOpen = true;
      this.chartCoach = coach;
    },
    closeChart() {
      this.chartOpen = false;
    },
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

  .page-container {
    padding: $pad 0;
  }

  .table {
    width: 75%;
    overflow: hidden;
    margin: 0 auto;

    thead th {
      font-weight: 400;
      @include ms-respond(font-size,-1);
      padding: .25rem .5rem;
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

    thead th:not([colspan]):not(.ranking) {
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover {
        background-color: #ccc;
      }
    }

    thead {
      border-bottom: 2px solid black;
    }

    td, tbody th {
      padding: .5rem;
    }

    tbody > tr {
      border-bottom: 1px solid $border-color;
    }

    &.is-collapsed {
      tr:nth-of-type(n+11){
        display: none;
      }
    }
  }

  .username > a {
    color: inherit;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .type, .elo, .wins, .losses, .ties, .all-wins, .all-losses, .all-ties {
    text-align: center;
  }

  .ranking {
    width: 7%;
  }

  .wins, .losses, .ties, .all-wins, .all-losses, .all-ties {
    display: none;
    width: 7%;

    @media screen and (min-width: $breakpoint-sm){
      display: table-cell;
    }
  }

  .type {
    display: none;

    @media screen and (min-width: $breakpoint-sm) {
      display: table-cell;
    }
  }

  .elo, .ties, .all-ties {
    border-right: 1px solid $border-color;
  }

  .username {
    width: 1%;
  }

  .sorter {
    display: inline-block;
    position: absolute;
    bottom: .375rem;
    margin-left: .25rem;
    color: $faded;
    font-size: 0.5rem;
    line-height: calc(1rem * (7 / 16));

    &.asc span.asc {
      color: black;
    }

    &.desc span.desc {
      color: black;
    }

    span {
      display: block;
    }
  }
</style>
