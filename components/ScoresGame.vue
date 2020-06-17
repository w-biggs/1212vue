<template>
  <table :class="['game', game.live ? '' : 'is-final']">
    <tbody>
      <tr>
        <td class="status">
          {{ statusString }}
        </td>
        <th v-for="index in numQuarters(game)" :key="index" class="quarter">
          {{ index }}
        </th>
        <th class="score">
          T
        </th>
      </tr>
      <tr v-for="(team, index) in [game.homeTeam, game.awayTeam]" :key="team.team.name">
        <td class="team">
          <LazyImg div-class="team-logo"
                   :data-bg="`/logos/${team.team.abbreviation}.svg`" />
          <span :class="['team-name', game.live
            && ((index === 0) !== game.status.homeOffense)? 'is-defense' : '']">
            {{ team.team.shortName || team.team.name }}
          </span>
        </td>
        <td v-for="scoreIndex in numQuarters(game)" :key="scoreIndex" class="quarter">
          {{ team.stats.score.quarters[scoreIndex - 1] || 0 }}
        </td>
        <td class="score">
          {{ team.stats.score.final }}
        </td>
      </tr>
    </tbody>
    <caption>
      <a :href="`https://reddit-stream.com/comments/${game.gameId}`" class="link" target="_blank" rel="noopener noreferrer">
        {{ streamText }}
      </a>
    </caption>
  </table>
</template>

<script>
import LazyImg from '~/components/LazyImg.vue';

export default {
  components: {
    LazyImg,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statusString() {
      if (this.game.live) {
        let yardLineString = this.game.status.yardLine;
        if (this.game.status.yardLine > 50) {
          const whoseYardLine = this.game.status.homeOffense
            ? this.game.awayTeam.team.abbreviation
            : this.game.homeTeam.team.abbreviation;
          yardLineString = `${whoseYardLine} ${100 - this.game.status.yardLine}`;
        } else if (this.game.status.yardLine < 50) {
          const whoseYardLine = this.game.status.homeOffense
            ? this.game.homeTeam.team.abbreviation
            : this.game.awayTeam.team.abbreviation;
          yardLineString = `${whoseYardLine} ${this.game.status.yardLine}`;
        }

        const mins = Math.floor(this.game.status.clock / 60);
        const secs = this.game.status.clock % 60;
        const clock = `${mins}:${String(secs).padStart(2, '0')}`;

        const down = this.ordinalize(this.game.status.down);

        return `${clock} ${this.game.status.quarter}Q - ${down} & ${this.game.status.distance} on ${yardLineString}`;
      }
      return 'Final';
    },
    streamText() {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const lastPlayTime = this.game.endTime ? this.game.endTime : this.game.startTime;
      const timeDiff = currentTimestamp - lastPlayTime;
      let timeString = `${timeDiff} sec${timeDiff > 1 ? 's' : ''}`;
      if (timeDiff > 86400) {
        timeString = `${Math.round(timeDiff / 86400)} day${Math.round(timeDiff / 86400) > 1 ? 's' : ''}`;
      } else if (timeDiff > 3600) {
        timeString = `${Math.round(timeDiff / 3600)} hour${Math.round(timeDiff / 3600) > 1 ? 's' : ''}`;
      } else if (timeDiff > 60) {
        timeString = `${Math.round(timeDiff / 60)} min${Math.round(timeDiff / 60) > 1 ? 's' : ''}`;
      }
      if (this.game.live) {
        return `Last play ${timeString} ago >`;
      }
      return `Finished ${timeString} ago >`;
    },
  },
  methods: {
    ordinalize(num) {
      const tens = num % 10;
      const huns = num % 100;
      if (tens === 1 && huns !== 11) {
        return `${num}st`;
      }
      if (tens === 2 && huns !== 12) {
        return `${num}nd`;
      }
      if (tens === 3 && huns !== 13) {
        return `${num}rd`;
      }
      return `${num}th`;
    },
    numQuarters() {
      const homeQs = this.game.homeTeam.stats.score.quarters;
      const awayQs = this.game.awayTeam.stats.score.quarters;
      return Math.max(homeQs.length, awayQs.length, 4);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/scss/variables";

  .game {
    border: 1px solid $border-color;
    margin: 0.5rem;
    width: 80%;

    caption {
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      padding: 0;
    }

    th {
      color: $faded;
      font-weight: normal;
      line-height: 1.5rem;
    }

    &.is-final .status {
      font-weight: bold;
      text-transform: uppercase;
    }

    @media screen and (min-width: $breakpoint-xs) {
      width: auto;
    }
  }

  .status{
    @include ms-respond(font-size,-1);
    padding: 0 0.5rem;
  }

  .quarter {
    @include ms-respond(font-size,0);
    font-family: $mono-font-family;
    width: 1.75rem;
    text-align: center;
    line-height: 2rem;
    display: none;

    &.is-loss {
      color: $faded;
    }

    @media screen and (min-width: $breakpoint-md) {
      display: table-cell;
    }
  }

  .score {
    @include ms-respond(font-size,0);
    font-family: $mono-font-family;
    width: 1.75rem;
    text-align: center;
    line-height: 2rem;
    font-weight: bold;

    &.is-loss {
      color: $faded;
    }
  }

  .team {
    width: auto;
    position: relative;
    padding: 0 0.5rem;

    @media screen and (min-width: $breakpoint-xs) {
      width: 12.5rem;
    }
  }

  .team-logo {
    height: 1.5rem;
    width: 1.5rem;
    display: block;
    position: absolute;
    top: 50%;
    left: 0.5rem; // padding
    transform: translateY(-50%);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .team-name {
    @include ms-respond(font-size,0);
    margin-left: 2rem; // image size
    line-height: 2rem;

    &.is-defense {
      color: $faded;
    }
  }

  .link {
    display: block;
    width: 100%;
    height: 100%;
    line-height: 1.5rem;
    @include ms-respond(font-size,-1);
    text-transform: uppercase;
    padding: 0 0.5rem;
    text-align: right;
    font-family: $system-font-family;
    font-weight: 600;
    color: #006FEE;

    &:hover {
      text-decoration: none;
    }
  }
</style>
