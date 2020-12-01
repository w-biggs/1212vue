/**
 * Sets the max height property of the scoreboard when collapsed.
 *
 * @returns {number} - The max height of the collapsed scoreboard.
 */
const getMaxHeight = function getMaxHeightOfCollapsedScoreboard() {
  const scoreboardGame = document.querySelector('.scoreboard .game');

  if (!scoreboardGame) {
    return 0;
  }

  // The height of a game in the scoreboard.
  const gameHeight = scoreboardGame.getBoundingClientRect().height;
  const gameStyle = getComputedStyle(scoreboardGame);

  // Height + margins, *2 (two rows)
  const maxHeight = (gameHeight
    + parseInt(gameStyle.marginTop, 10)
    + parseInt(gameStyle.marginBottom, 10))
    * 2;

  return maxHeight;
};

/**
 * Check whether the "show more" button should be visible.
 *
 * @param {number} maxHeight - The max height of a collapsed scoreboard.
 * @param {HTMLElement} scoreboard - The scoreboard element.
 */
const checkShowButton = function checkIfExpandScoreboardButtonShouldShow(maxHeight) {
  const scoreboard = document.getElementsByClassName('scoreboard')[0];

  if (scoreboard.scrollHeight > maxHeight) {
    return true;
  }
  return false;
};

module.exports = {
  getMaxHeight,
  checkShowButton,
};
