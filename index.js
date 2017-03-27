module.exports = {
  random: require("./examples/random"),
  noprincess: require("./examples/noprincess"),
  goodguess: require("./examples/goodguess"),
  playerapi: require('./app'),
  cardtypes: require('./definitions/cardtypes'),
  cli: require("./cli"),
  start: require("./appstart"),
  loadStrategies: require("./strategyloader"),
  CardModel: require("./utility/cardmodel"),
  OpponentModel: require("./utility/opponentmodel")
};

