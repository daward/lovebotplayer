module.exports = {
  random: require("./examples/random"),
  noprincess: require("./examples/noprincess"),
  goodguess: require("./examples/goodguess"),
  playerapi: require('./app'),
  cardtypes: require('./definitions/cardtypes'),
  start: (config) => {
    let strategies = require("./strategyloader")(config);
    const _ = require("lodash");
    let app = require('./app.js');
    app.start(
      _.get(config, "port", 8080), 
      _.get(config, "enableLogging", false), 
      strategies);
    
    return strategies;
  },
  loadStrategies: require("./strategyloader")
};

