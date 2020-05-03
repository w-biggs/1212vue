<template>
  <div class="page-container">
    <h2 class="section-header">Scores</h2>
    <div class="nav">
      <label for="season" class="sr-only">Season:</label>
      <select id="season" ref="seasonSelect" class="season" @change="handleSelects">
        <option v-for="season in seasons" :key="season.seasonNo" :value="season.seasonNo"
                :selected="season.seasonNo === seasonNo">
          Season {{ season.seasonNo }}
        </option>
      </select>
      <label for="week" class="sr-only">Week:</label>
      <select id="week" ref="weekSelect" class="week" @change="handleSelects">
        <option v-for="week in selectedSeasonWeeks" :key="week.weekNo" :value="week.weekNo"
                :selected="week.weekNo === weekNo">
          Week {{ week.weekNo }}
        </option>
      </select>
      <label for="conf" class="sr-only">Conference:</label>
      <select id="conf" ref="confSelect" class="conf" @change="handleSelects">
        <option value="" :selected="!conf">All Conferences</option>
        <option v-for="conference in confs" :key="conference.shortName"
                :value="conference.shortName" :selected="conference.shortName === conf">
          {{ conference.shortName }}
        </option>
      </select>
    </div>
    <div class="games">
      <template v-for="game in games">
        <ScoresGame :key="game.gameId" :game="game" />
      </template>
    </div>
  </div>
</template>

<script>
import ScoresGame from '~/components/ScoresGame.vue';

export default {
  components: {
    ScoresGame,
  },
  asyncData({
    $axios, isDev, params, redirect, store,
  }) {
    let { season, week } = params;
    const { conf } = params;
    [season, week] = [season, week].map((x) => parseInt(x, 10));

    const apiLink = isDev ? 'http://localhost:12121' : 'https://api.1212.one';

    const { seasons } = store.state.seasons;
    const requestedSeason = seasons.find((filterSeason) => filterSeason.seasonNo === season);
    const requestedWeek = requestedSeason.weeks.find((filterWeek) => filterWeek.weekNo === week);

    if (!requestedWeek) {
      const latestWeek = requestedSeason.weeks[requestedSeason.weeks.length - 1].weekNo;
      return redirect(302, `/scores/${season}/${latestWeek}`);
    }

    const query = `${apiLink}/games/${season}/${week}/${conf || ''}`;

    return $axios.$get(query)
      .then((response) => {
        if (response.games) {
          return {
            games: response.games,
            isDev,
            seasonNo: season,
            weekNo: week,
            conf,
          };
        }
        return false;
      });
  },
  data() {
    return {
      games: [{
        homeTeam: {
          team: {
            name: 'Loading...',
          },
          stats: {
            score: {
              quarters: [],
              final: '--',
            },
          },
        },
        awayTeam: {
          team: {
            name: 'Loading...',
          },
          stats: {
            score: {
              quarters: [],
              final: '--',
            },
          },
        },
        live: false,
      }],
      isDev: false,
      seasonNo: 1,
      weekNo: 1,
      conf: '',
      gameRefresh: null,
    };
  },
  computed: {
    seasons() {
      return this.$store.state.seasons.seasons;
    },
    selectedSeasonWeeks() {
      return this.seasons.filter((season) => season.seasonNo === this.seasonNo)[0].weeks;
    },
    confs() {
      return this.$store.state.confs.confs;
    },
  },
  mounted() {
    if (process.client) {
      const apiLink = this.isDev ? 'http://localhost:12121' : 'https://api.1212.one';
      this.gameRefresh = setInterval(() => this.$axios.$get(
        `${apiLink}/games/${this.seasonNo}/${this.weekNo}/${this.conf ? this.conf : ''}`,
      )
        .then((response) => {
          if (response.games) {
            console.log('fetched scores games');
            this.games = response.games;
          }
        })
        .catch(console.error), 60000);
    }
  },
  methods: {
    handleSelects() {
      const seasonVal = this.$refs.seasonSelect.value;
      const weekVal = this.$refs.weekSelect.value;
      const confVal = this.$refs.confSelect.value;
      this.$router.push({
        path: `/scores/${seasonVal}/${weekVal}/${confVal}`,
      });
    },
  },
  head() {
    return {
      title: `Scores - ${this.$store.state.misc.siteName}`,
    };
  },
  validate({ params }) {
    if (!/^\d+$/.test(params.season) || !/^\d+$/.test(params.week)) {
      return false;
    }
    return true;
  },
  beforeRouteLeave(to, from, next) {
    console.log('clearing');
    clearInterval(this.gameRefresh);
    next();
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/scss/variables";

  .page-container {
    padding: $pad 0;
  }

  .nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @media screen and (min-width: $breakpoint-sm) {
      justify-content: flex-start;
    }

    select{
      margin: 0.5rem;

      @media screen and (min-width: $breakpoint-sm) {
        &.conf{
          margin-left: auto;
        }
      }
    }
  }

  .games {
    display: flex;
    padding: $pad 0;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-around;
  }
</style>
