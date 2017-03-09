let _ = require("lodash");
let cardsLeft = require("./cardsremaining");
let cardtypes = require("../definitions/cardtypes");
let randomStatements = require("./randomstatements");

module.exports = (player, opponents) => {

  let selected = _.sample(_.filter(player.cards, card => card !== "princess"));

  let randCardGuess = () => {
    let choices = cardsLeft(opponents, player);
    return _.sample(_.filter(choices, type => type !== "guard"));
  };

  let cardParameters = (cardType) => {
    let opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randomStatements.randOpponent(opponents, player);
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randCardGuess();
    }

    return opts;
  };

  return Promise.resolve({ selected, cardParameters: cardParameters(cardtypes[selected]) });
};