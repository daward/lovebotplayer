let _ = require("lodash");
let cardTypes = require("../definitions/cardtypes");

module.exports = (opponents, player) => {
  let opponentPlays = _.flatten(_.map(opponents, opponent => opponent.plays));
  let plays = _.concat(opponentPlays, player.plays, player.cards);
  let cardsPlayed = _.countBy(plays, play => play.name);

  let cardsRemaining = [];
  _.forIn(cardTypes, (value, key) => {
    var left = value.quantity - (cardsPlayed[key] || 0);
    _.times(left, () => cardsRemaining.push(key));
  });

  return cardsRemaining;
};