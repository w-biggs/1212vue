<template>
  <div class="page-container">
    <h2 class="section-header">Standings</h2>
    <div v-for="conf in standings" :key="conf.name" class="conf">
      <h3 class="conf-name">{{ conf.name }}</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th colspan="2" />
              <th colspan="3">
                <span>Conference</span>
              </th>
              <th v-if="conf.divisions.length > 1" colspan="3">
                <span>Division</span>
              </th>
              <th colspan="4">
                <span>Overall</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="div in conf.divisions">
              <tr :key="div.name" class="subhead">
                <th />
                <th>{{ div.name }}</th>
                <th>Record</th>
                <th>PF</th>
                <th>PA</th>
                <th v-if="conf.divisions.length > 1">Record</th>
                <th v-if="conf.divisions.length > 1">PF</th>
                <th v-if="conf.divisions.length > 1">PA</th>
                <th>Record</th>
                <th>PF</th>
                <th>PA</th>
                <th>Streak</th>
              </tr>
              <tr v-for="(team, index) in div.teams" :key="team.name">
                <td>{{ index + 1 }}</td>
                <td class="team">
                  <LazyImg div-class="team-logo"
                           :data-bg="`/logos/${team.abbreviation}.svg`"
                           aria-hidden="true" />
                  <span class="team-full">{{ team.name }}</span>
                  <span class="team-abbr">{{ team.abbreviation }}</span>
                </td>
                <td>
                  {{ team.conference.wins }}-{{ team.conference.losses }}{{
                    team.conference.ties ? `-${team.conference.ties}` : ''
                  }}
                </td>
                <td>{{ team.conference.pf }}</td>
                <td>{{ team.conference.pa }}</td>
                <td v-if="conf.divisions.length > 1">
                  {{ team.division.wins }}-{{ team.division.losses }}{{
                    team.division.ties ? `-${team.division.ties}` : ''
                  }}
                </td>
                <td v-if="conf.divisions.length > 1">{{ team.division.pf }}</td>
                <td v-if="conf.divisions.length > 1">{{ team.division.pa }}</td>
                <td>
                  {{ team.overall.wins }}-{{ team.overall.losses }}{{
                    team.overall.ties ? `-${team.overall.ties}` : ''
                  }}
                </td>
                <td>{{ team.overall.pf }}</td>
                <td>{{ team.overall.pa }}</td>
                <td>{{ team.overall.streak.type }}{{ team.overall.streak.duration }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="errata">
      <p>Standings are decided as follows:</p>
      <ol>
        <li>Teams' conference wins</li>
        <li>Teams' conference games over .500</li>
        <li>Head-to-head (or head-to-head sweep if 3+ teams)</li>
        <li>Teams' division wins</li>
        <li>Teams' division games over .500</li>
        <li>Teams' record in common games</li>
        <li>
          Teams' record vs. the next highest placed teams in their division, then conference, in
          order of finish. (If a group of tied teams is arrived at, look at each each team's record
          vs. the collective tied teams as a group, rather than record against the individual
          teams.)
        </li>
      </ol>
      <p>
        However, the 7th tiebreaker is currently not implemented here because I haven't taken the
        time to code that yet, so don't take the above standings as pure fact - some tiebreakers may
        need to be verified by hand.
      </p>
      <p>
        Head-to-head and common games tiebreakers with 3+ teams are also not handled correctly, and
        writing the code to handle them correctly is a chore.
      </p>
    </div>
  </div>
</template>

<script>
import LazyImg from '~/components/LazyImg.vue';

export default {
  components: {
    LazyImg,
  },
  async asyncData({
    $axios, store, params, isDev,
  }) {
    const { season } = params;
    const apiLink = isDev ? 'http://localhost:12121' : 'https://api.1212.one';
    const standings = await $axios.$get(`${apiLink}/standings/${season || store.state.games.current.season}`);
    return {
      standings,
    };
  },
  data() {
    return {
      standings: [],
    };
  },
  head() {
    return {
      title: `Standings - ${this.$store.state.misc.siteName}`,
    };
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
    overflow-x: hidden;
  }

  .conf {
    max-width: 100%;

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }

  .table-container {
    max-width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    max-width: 100%;
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    overflow-x: scroll;
  }

  th {
    text-transform: uppercase;
    @include ms-respond(font-size,-1);
    position: relative;
    vertical-align: middle;
    background-clip: padding-box;

    & > span {
      vertical-align: baseline;
    }
  }

  th, td {
    padding: .25rem;
    text-align: center;
    white-space: nowrap;
  }

  tbody > tr {
    th:nth-child(2), td:nth-child(2),
    th:nth-child(5), td:nth-child(5),
    th:nth-last-child(5), td:nth-last-child(5) {
      border-right: 1px solid $border-color;
    }

    th:nth-child(1), td:nth-child(1) {
      width: 2%;
      min-width: 1.5rem;
    }

    th:nth-child(2), td:nth-child(2) {
      text-align: left;
      width: 15%;
      min-width: 6rem;
      @media screen and (min-width: $breakpoint-xs){
        min-width: 16rem;
      }
    }

    th:nth-child(n+3), td:nth-child(n+3) {
      min-width: 5%;
      min-width: 2.5rem;
    }
  }

  .subhead {
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
  }

  .team {
    padding-left: 1.5rem; // image size
    position: relative;
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

  .team-full {
    display: none;
    @media screen and (min-width: $breakpoint-xs){
      display: inline;
    }
  }
  .team-abbr {
    display: inline;
    @media screen and (min-width: $breakpoint-xs){
      display: none;
    }
  }

  .errata {
    @include ms-respond(font-size,-1);
    margin-top: 1em;

    p {
      margin: .5em 0;
    }

    ol {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
</style>
