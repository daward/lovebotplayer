let _ = require("lodash");
let randomStatements = require("./randomstatements");

module.exports = (player, opponents) => {

  // if the card requires information from the player to be played, do so here
  var cardParameters = (cardType) => {
    var opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randomStatements.randOpponent(opponents, player);
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randomStatements.randCardGuess();
    }

    return opts;
  };

  let selected = randomStatements.randPlay(player);
  return Promise.resolve({ selected: selected.name, cardParameters: cardParameters(selected) });
};