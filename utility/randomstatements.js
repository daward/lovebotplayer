let _ = require("lodash");
let cardtypes = require("../definitions/cardtypes");

module.exports = {
  randOpponent: (opponents, player) => {
    let opponent = _.sample(_.filter(opponents, opponent => opponent.active && !opponent.protected));
    if (!opponent) {
      return player.number;
    } else {
      return opponent.number;
    }
  },

  randCardGuess: () => _.sample(_.filter(cardtypes, type => type !== "guard")),
  randPlay: (player) => {
    let name = _.sample(player.cards);
    return _.merge({ name: name }, cardtypes[name]);
  }
};