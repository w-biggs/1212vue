<template>
  <div class="game">
    <div class="teams">
      <div class="team">
        <div v-bind:class="['team-name', game.live && game.status.homeOffense ? '' : 'is-defense']">
          {{game.homeTeam.team.name}}
        </div>
        <div v-bind:class="['team-score', game.live ? '' : 'is-final', game.homeTeam.stats.score.final > game.awayTeam.stats.score.final ? 'is-win' : 'is-loss']">
          {{game.homeTeam.stats.score.final}}
        </div>
      </div>
      <div class="team">
        <div v-bind:class="['team-name', game.live && game.status.homeOffense ? 'is-defense' : '']">
          {{game.awayTeam.team.name}}
        </div>
        <div v-bind:class="['team-score', game.live ? '' : 'is-final', game.awayTeam.stats.score.final > game.homeTeam.stats.score.final ? 'is-win' : 'is-loss']">
          {{game.awayTeam.stats.score.final}}
        </div>
      </div>
    </div>
    <div class="status">
      {{statusString}}
    </div>
    <a v-bind:href="`https://reddit-stream.com/comments/${game.gameId}`" class="stream-link" target="_blank" rel="noopener noreferrer">
      {{streamText}}
    </a>
  </div>
</template>

<script>
export default {
  props: ['game'],
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
  },
  computed: {
    statusString() {
      if (this.game.live) {
        let yardLineString = this.game.status.yardLine;
        if (this.game.status.yardLine > 50) {
          const whoseYardLine = this.game.awayTeam.team.abbreviation;
          yardLineString = `${whoseYardLine} ${100 - this.game.status.yardLine}`;
        } else if (this.game.status.yardLine < 50) {
          const whoseYardLine = this.game.awayTeam.team.abbreviation;
          yardLineString = `${whoseYardLine} ${this.game.status.yardLine}`;
        }

        let mins = Math.floor(this.game.status.clock / 60);
        let secs = this.game.status.clock % 60;
        let clock = `${mins}:${String(secs).padStart(2,'0')}`;

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
        return `Last play ${timeString} ago`;
      }
      return `Finished ${timeString} ago`;;
    },
  },
}
</script>

<style scoped lang="scss">
  @import "~assets/scss/variables";

  .game{
    border: 1px solid $border-color;
    margin: 0.5rem;
  }

  .teams{
    border-bottom: 1px solid $border-color;
  }

  .team{
    display: flex;
    width: 12.5rem;
  }

  .team-name{
    @include ms-respond(font-size,-0.5);
    flex: 1;
    line-height: 1.625rem;
    padding: 0 0.5rem;
    position: relative;

    &.is-defense{
      color: $faded;
    }
  }

  .team-score{
    @include ms-respond(font-size,0);
    border-left: 1px solid $border-color;
    font-family: $mono-font-family;
    padding: 0 0.25rem;
    flex: 0 0 2.125rem;
    width: 2.125rem;
    text-align: center;
    line-height: 1.625rem;

    &.is-final{
      font-weight: bold;

      &.is-loss{
        color: $faded;
      }
    }
  }

  .status{
    font-family: $system-font-family;
    font-weight: 600;
    border-bottom: 1px solid $border-color;
    line-height: 1.125rem;
    padding: 0 0.5rem;
    @include ms-respond(font-size,-1.5);
  }

  .stream-link{
    display: block;
    line-height: 1.125rem;
    @include ms-respond(font-size,-1.5);
    text-transform: uppercase;
    padding: 0 0.5rem;
    text-align: right;
    font-family: $system-font-family;
    font-weight: 600;
    color: #006FEE;

    &:hover{
      text-decoration: none;
    }
  }
</style>
