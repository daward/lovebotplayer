let _ = require("lodash");
let cardtypes = require("../definitions/cardtypes");
let randomStatements = require("./randomstatements");

module.exports = (player, opponents) => {
  let randCardGuess = () => {
    return _.sample(_.filter(_.keys(cardtypes), type => type !== "guard"));
  };

  let cardParameters = (cardType) => {
    var opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randomStatements.randOpponent(opponents, player);
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randCardGuess();
    }

    return opts;
  };

  let selected = _.sample(_.filter(player.cards, card => card !== "princess"));
  return Promise.resolve({ selected, cardParameters: cardParameters(cardtypes[selected]) });
};