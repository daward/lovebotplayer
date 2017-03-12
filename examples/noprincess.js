let _ = require("lodash");
let cardtypes = require("../definitions/cardtypes");
let randomStatements = require("../utility/randomstatements");

module.exports = (player, opponents) => {
  let randCardGuess = () => {
    return _.sample(_.filter(_.keys(cardtypes), type => type !== cardtypes.guard.name));
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

  let selectedCard = _.sample(_.filter(player.cards, card => card.name !== cardtypes.princess.name)); 
  let selected = selectedCard.name;
  
  return { selected, cardParameters: cardParameters(cardtypes[selected]) };
};