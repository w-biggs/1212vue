<template>
  <div class="metrics">
    <h2 class="section-header">Metrics</h2>
    <template v-if="metrics.length">
      <table :class="['table', collapsed ? 'is-collapsed' : '']">
        <thead>
          <tr>
            <th class="elo-rating" v-on:click="setSort(false, $event)">
              <span>Elo</span>
              <div :class="['sorter', sorterClass('elo-rating')]">
                <span class="asc">▲</span>
                <span class="desc">▼</span>
              </div>
            </th>
            <th class="elo-change" v-on:click="setSort(false, $event)">
              <span>±</span>
              <div :class="['sorter', sorterClass('elo-change')]">
                <span class="asc">▲</span>
                <span class="desc">▼</span>
              </div>
            </th>
            <th class="team" v-on:click="setSort(true, $event)">
              <span>TEAM</span>
              <div :class="['sorter', sorterClass('team')]">
                <span class="asc">▲</span>
                <span class="desc">▼</span>
              </div>
            </th>
            <th class="conf" v-on:click="setSort(true, $event)">
              <span>Conference<span class="elo-div"> / Division</span></span>
              <div :class="['sorter', sorterClass('conf')]">
                <span class="asc">▲</span>
                <span class="desc">▼</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody ref="metricsTableBody">
          <tr v-for="team in metrics" :key="team.name">
            <td class="elo-rating" :title="team.elo.toFixed(4)" :data-value="team.elo">
              <span>{{ Math.round(team.elo) }}</span>
            </td>
            <td class="elo-change" :title="team.eloChange && team.eloChange.toFixed(4)" :data-value="team.eloChange || '0'">
              <span v-if="team.eloChange" :class="['elo-change-value', team.eloChange < 0 ? 'is-decrease' : 'is-increase']">
                {{ team.eloChange > 0 ? '+' : '' }}{{ Math.round(team.eloChange) }}
              </span>
            </td>
            <td class="team" :data-value="team.name">
              <a :href="`#${encodeURI(team.name)}`">
                <LazyImg divClass="team-logo" :data-bg="require(`~/assets/images/logos/${team.abbreviation}.svg`)" aria-hidden="true" />
                <span>{{ team.name }}</span>
              </a>
            </td>
            <td class="conf" :title="`${team.conf} - ${team.div}`" :data-value="`${team.conf} - ${team.div}`">
              {{ team.conf }}
              <span class="div" v-if="team.div !== 'N/A'">
                - {{ team.div }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="expand">
        <button :aria-expanded="!collapsed" v-on:click="handleMetricsButton">
          {{ collapsed ? 'Show more' : 'Show less' }}
        </button>
      </div>
    </template>
    <span v-else>Loading...</span>
  </div>
</template>

<script>
import LazyImg from '~/components/LazyImg';

export default {
  components: {
    LazyImg
  },
  data() {
    return {
      collapsed: true,
      sort: {
        by: 'elo-rating',
        asc: false,
      },
    };
  },
  methods: {
    handleMetricsButton(event) {
      this.collapsed = !this.collapsed;
    },
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
  },
  computed: {
    current() {
      return this.$store.state.games.current;
    },
    metrics() {
      return this.$store.state.metrics.metrics;
    },
  },
}
</script>

<style scoped lang="scss">
  @import "~assets/scss/variables";

  .metrics {
    padding: $pad 0;
    grid-area: elo;

    @media screen and (min-width: $breakpoint-md){
      padding-right: $pad;
    }
  }

  .table {
    width: 100%;
    overflow: hidden;

    th {
      font-weight: 400;
      @include ms-respond(font-size,-1);
      padding: .25rem 1rem .25rem .5rem;
      position: relative;
      vertical-align: middle;
      cursor: pointer;
      transition: background-color 0.15s;
      background-clip: padding-box;

      &:not(.elo-no-upper) {
        text-transform: uppercase;
      }

      &:hover {
        background-color: #ccc;
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

    &.is-collapsed {
      tr:nth-of-type(n+11){
        display: none;
      }
    }
  }

  .elo-rating, .wpn {
    width: 1%;
  }

  td.elo-rating {
    white-space: nowrap;
    display: flex;
    align-items: center;
  }

  .elo-change {
    display: none;
    width: 1%;

    @media screen and (min-width: $breakpoint-xs){
      display: table-cell;
    }
  }

  .elo-change-value {
    background-color: #ccc;
    @include ms-respond(font-size,-2);
    border-radius: 1rem;
    padding: .25em .5em;
    display: block;

    &.is-increase {
      background-color: rgba(68,171,67,.5);
    }

    &.is-decrease {
      background-color: rgba(255,39,0,.5);
    }
  }

  .team {
    vertical-align: middle;
  }

  .team > a {
    color: inherit;
    font-weight: 700;
    text-decoration: none;
    padding-left: 1.5rem; // image size
    position: relative;
  }

  .team > a:hover > span {
    text-decoration: underline;
  }

  .team-logo {
    height: 1.25rem;
    width: 1.25rem;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .record {
    font-family: $mono-font-family;
    @include ms-respond(font-size,-1);
    color: $faded;
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

  .expand{
    width: 100%;

    button{
      margin: 0.5rem auto;
      background-color: white;
      border: 1px solid black;
      padding: 0.625rem 0.5rem;
      line-height: 1;
      display: block;
      transition: background-color 0.15s ease;

      &:hover{
        background-color: $placeholder-grey;
      }
    }
  }
</style>
