<template>
  <div class="page-container">
    <h2 class="section-header">Stats</h2>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr class="top-header">
            <th colspan="2"></th>
            <th colspan="3">Record</th>
            <th colspan="9">Combined</th>
            <th colspan="14">Offense</th>
            <th colspan="14">Defense</th>
          </tr>
          <tr class="sortable">            <th class="rank nosort">
              <span>#</span>
            </th>
            <th :class="['name', sorterClass('name')]" @click="setSort(true, $event)">
              <span>Team Name</span>
            </th>
            <th title="Wins" :class="['wins', sorterClass('wins')]" @click="setSort(false, $event)">
              <span>W</span>
            </th>
            <th title="Losses" :class="['losses', sorterClass('losses')]" @click="setSort(false, $event)">
              <span>L</span>
            </th>
            <th title="Ties" :class="['ties', sorterClass('ties')]" @click="setSort(false, $event)">
              <span>T</span>
            </th>
            <th title="Point Differential" :class="['pointDiff', sorterClass('pointDiff')]" @click="setSort(false, $event)">
              <span>P&Delta;</span>
            </th>
            <th title="Adjusted Point Differential Per Game" :class="['adjPointDiffPG', sorterClass('adjPointDiffPG')]" @click="setSort(false, $event)">
              <span>aP&Delta;/G</span>
            </th>
            <th title="Yardage Differential" :class="['yardDiff', sorterClass('yardDiff')]" @click="setSort(false, $event)">
              <span>Y&Delta;</span>
            </th>
            <th title="Adjusted Yardage Differential Per Game" :class="['adjYardDiffPG', sorterClass('adjYardDiffPG')]" @click="setSort(false, $event)">
              <span>aY&Delta;/G</span>
            </th>
            <th title="Turnover Differential" :class="['turnoverDiff', sorterClass('turnoverDiff')]" @click="setSort(false, $event)">
              <span>TO&Delta;</span>
            </th>
            <th title="Expected Wins" :class="['expectedWins', sorterClass('expectedWins')]" @click="setSort(false, $event)">
              <span>xW</span>
            </th>
            <th title="Expected Losses" :class="['expectedLosses', sorterClass('expectedLosses')]" @click="setSort(false, $event)">
              <span>xL</span>
            </th>
            <th title="Wins Over Expected" :class="['expectedDiff', sorterClass('expectedDiff')]" @click="setSort(false, $event)">
              <span>x&Delta;</span>
            </th>
            <th title="Time Played Per Game" :class="['timePG', sorterClass('timePG')]" @click="setSort(false, $event)">
              <span>Time/G</span>
            </th>
            <th title="Pass Yards" :class="['off-passYds', sorterClass('off-passYds')]" @click="setSort(false, $event)">
              <span>PYds</span>
            </th>
            <th title="Rush Yards" :class="['off-rushYds', sorterClass('off-rushYds')]" @click="setSort(false, $event)">
              <span>RYds</span>
            </th>
            <th title="Total Yards" :class="['off-yards', sorterClass('off-yards')]" @click="setSort(false, $event)">
              <span>Yds</span>
            </th>
            <th title="Interceptions" :class="['off-interceptions', sorterClass('off-interceptions')]" @click="setSort(false, $event)">
              <span>INT</span>
            </th>
            <th title="Fumbles" :class="['off-fumbles', sorterClass('off-fumbles')]" @click="setSort(false, $event)">
              <span>FUM</span>
            </th>
            <th title="Turnovers" :class="['off-turnovers', sorterClass('off-turnovers')]" @click="setSort(false, $event)">
              <span>TO</span>
            </th>
            <th title="Field Goal Attempts" :class="['off-attempts', sorterClass('off-attempts')]" @click="setSort(false, $event)">
              <span>FGA</span>
            </th>
            <th title="Field Goals Made" :class="['off-makes', sorterClass('off-makes')]" @click="setSort(false, $event)">
              <span>FGM</span>
            </th>
            <th title="Points For" :class="['off-points', sorterClass('off-points')]" @click="setSort(false, $event)">
              <span>PF</span>
            </th>
            <th title="Adjust Points For Per Game" :class="['off-adjPointsPG', sorterClass('off-adjPointsPG')]" @click="setSort(false, $event)">
              <span>aPF/G</span>
            </th>
            <th title="Time of Possession Per 28 Minutes" :class="['off-timeOfPossessionP28', sorterClass('off-timeOfPossessionP28')]" @click="setSort(false, $event)">
              <span>ToP/28</span>
            </th>
            <th title="Adjusted Pass Yards Per Game" :class="['off-adjPassYdsPG', sorterClass('off-adjPassYdsPG')]" @click="setSort(false, $event)">
              <span>aPY/G</span>
            </th>
            <th title="Adjusted Rush Yards Per Game" :class="['off-adjRushYdsPG', sorterClass('off-adjRushYdsPG')]" @click="setSort(false, $event)">
              <span>aRY/G</span>
            </th>
            <th title="Adjusted Total Yards Per Game" :class="['off-adjYardsPG', sorterClass('off-adjYardsPG')]" @click="setSort(false, $event)">
              <span>aY/G</span>
            </th>
            <th title="Pass Yards" :class="['def-passYds', sorterClass('def-passYds')]" @click="setSort(false, $event)">
              <span>PYds</span>
            </th>
            <th title="Rush Yards" :class="['def-rushYds', sorterClass('def-rushYds')]" @click="setSort(false, $event)">
              <span>RYds</span>
            </th>
            <th title="Total Yards" :class="['def-yards', sorterClass('def-yards')]" @click="setSort(false, $event)">
              <span>Yds</span>
            </th>
            <th title="Interceptions" :class="['def-interceptions', sorterClass('def-interceptions')]" @click="setSort(false, $event)">
              <span>INT</span>
            </th>
            <th title="Fumbles" :class="['def-fumbles', sorterClass('def-fumbles')]" @click="setSort(false, $event)">
              <span>FUM</span>
            </th>
            <th title="Turnovers" :class="['def-turnovers', sorterClass('def-turnovers')]" @click="setSort(false, $event)">
              <span>TO</span>
            </th>
            <th title="Field Goal Attempts" :class="['def-attempts', sorterClass('def-attempts')]" @click="setSort(false, $event)">
              <span>FGA</span>
            </th>
            <th title="Field Goals Made" :class="['def-makes', sorterClass('def-makes')]" @click="setSort(false, $event)">
              <span>FGM</span>
            </th>
            <th title="Points Allowed" :class="['def-points', sorterClass('def-points')]" @click="setSort(false, $event)">
              <span>PA</span>
            </th>
            <th title="Adjusted Points Allowed Per Game" :class="['def-adjPointsPG', sorterClass('def-adjPointsPG')]" @click="setSort(false, $event)">
              <span>aPA/G</span>
            </th>
            <th title="Time of Possession Per 28 Minutes" :class="['def-timeOfPossessionP28', sorterClass('def-timeOfPossessionP28')]" @click="setSort(false, $event)">
              <span>ToP/28</span>
            </th>
            <th title="Adjusted Pass Yards Per Game" :class="['def-adjPassYdsPG', sorterClass('def-adjPassYdsPG')]" @click="setSort(false, $event)">
              <span>aPY/G</span>
            </th>
            <th title="Adjusted Rush Yards Per Game" :class="['def-adjRushYdsPG', sorterClass('def-adjRushYdsPG')]" @click="setSort(false, $event)">
              <span>aRY/G</span>
            </th>
            <th title="Adjusted Total Yards Per Game" :class="['def-adjYardsPG', sorterClass('def-adjYardsPG')]" @click="setSort(false, $event)">
              <span>aY/G</span>
            </th>
          </tr>
        </thead>
        <tbody ref="statsTableBody">
          <tr v-for="(team, index) in stats" :key="team.name">
            <td class="rank">{{ index + 1 }}</td>
            <td v-for="stat in team" :key="stat.name" :class="[stat.name, (sort.by === stat.name) ? 'sorting' : '']"
              :data-value="stat.value" :title="stat.title">
              {{ stat.display }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sort: {
          by: 'name',
          asc: true,
        },
      };
    },
    head () {
      return {
        title: `Stats - ${this.$store.state.misc.siteName}`,
      }
    },
    async asyncData({ store }) {
      await store.dispatch('stats/get');
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
          return this.sort.asc ? 1 : -1;
        }
        if (valB > valA) {
          return this.sort.asc ? -1 : 1;
        }
        return 0;
      },
      sortTable() {
        const tbody = this.$refs.statsTableBody;
        const rows = Array.from(tbody.children);

        // Sort the rows
        rows.sort(this.sortRows);

        // Delete all rows
        this.emptyNode(tbody);

        // Re-add the rows in the sorted order.
        for (let i = 0; i < rows.length; i += 1) {
          const row = rows[i];
          const ranking = row.getElementsByClassName('rank')[0];
          ranking.textContent = i + 1;
          tbody.appendChild(row);
        }
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
    },
    computed: {
      stats() {
        const parseStat = function parseStat(name, value, prefix = '') {
          const stat = {
            name: prefix + name,
            value,
            title: value,
            display: value,
          }
          switch (name) {
            case 'adjPointDiffPG':
            case 'adjYardDiffPG':
            case 'timePG':
            case 'adjPassYdsPG':
            case 'adjRushYdsPG':
            case 'adjYardsPG':
              stat.title = value.toFixed(1);
              stat.display = value.toFixed(0);
              break;
            case 'expectedWins':
            case 'expectedLosses':
            case 'expectedDiff':
            case 'adjPointsPG':
              stat.title = value.toFixed(2);
              stat.display = value.toFixed(1);
              break;
            case 'timeOfPossessionP28':
              stat.title = value.toFixed(3);
              stat.display = value.toFixed(2);
              break;
            default:
              break;
          }
          return stat;
        };

        let num = 0;

        const parseStatsObj = function parseStatsObj(object, name = '', parent = '') {
          let stats = [];
          let prefix = '';
          if (name === 'offenseStats') {
            prefix = 'off-';
          } else if (name === 'defenseStats') {
            prefix = 'def-';
          }
          for (let i = 0; i < Object.getOwnPropertyNames(object).length; i += 1) {
            const statName = Object.getOwnPropertyNames(object)[i];
            const value = object[statName];
            if (typeof value === 'object') {
              const objStats = parseStatsObj(value, prefix ? name : statName, name);
              stats = stats.concat(objStats);
            } else {
              if (statName !== 'timeOfPossession' && statName !== 'gameTime') {
                stats.push(parseStat(statName, value, prefix));
              }
            }
          }
          return stats;
        }

        const stats = [];
        const rawStats = this.$store.state.stats.stats;

        for (let i = 0; i < rawStats.length; i += 1) {
          const team = JSON.parse(JSON.stringify(rawStats[i])); // make it non-reactive
          stats.push(parseStatsObj(team));
        }

        return stats;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }

  .table-container {
    width: 100%;
    height: 80vh;
    overflow: auto;
    border-top: 1px solid $border-color;
  }

  .table {
    @include ms-respond(font-size,-1);
    width: 100%;
    position: relative;
  }

  thead {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 2;
  }

  th {
    position: relative;
    vertical-align: middle;
    background-clip: padding-box;
    background: #fff;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: calc(100% + 1px);
      height: 0.8px; /* Fix scaling issue */
      background-color: $border-color;
    }

    & > span {
      vertical-align: baseline;
    }

    &.desc {
      background-color: #57bb8a;

      &:hover {
        background-color: desaturate($color: #57bb8a, $amount: 50);
      }
    }

    &.asc {
      background-color: #e67c73;

      &:hover {
        background-color: desaturate($color: #e67c73, $amount: 50);
      }
    }
  }

  th, td {
    padding: .125rem .25rem;
    white-space: nowrap;
    text-align: center;
    min-width: 2rem;
  }

  .ties, .timePG, .off-adjYardsPG {
    border-right: 1px solid $border-color;
  }

  .name, th.ties, th.timePG, th.off-adjYardsPG {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -1px;
      width: 0.8px;
      height: 100%;
      background-color: $border-color;
    }
  }

  .name {
    text-align: left;
    width: 15%;
    position: sticky;
    left: 0;
    background: #FFF;
    z-index: 1;
  }

  .sortable > th {
    transition: background-color 0.15s;

    &:not(.nosort):hover{
      background-color: #ccc;
      cursor: pointer;
    }
  }

  .sorting {
    background-color: #eee;
  }

  .top-header > th:not(:last-child) {
    border-right: 1px solid $border-color;
  }
</style>
