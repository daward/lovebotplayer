let _ = require("lodash");
let cardtypes = require("../definitions/cardtypes");

module.exports = {
  randOpponent: (opponents, player) => {
    let opponent = _.sample(_.filter(opponents, opponent => opponent.active && !opponent.protected));
    if (!opponent) {
      return player.id;
    } else {
      return opponent.id;
    }
  },

  randCardGuess: () => _.sample(_.filter(cardtypes, type => type !== cardtypes.guard.name)),
  randPlay: (player) => {
    let selectedCard = _.sample(player.cards);
    return _.merge({ name: selectedCard.name }, cardtypes[selectedCard.name]);
  }
};