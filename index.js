module.exports = {
  random: require("./examples/random"),
  noprincess: require("./examples/noprincess"),
  goodguess: require("./examples/goodguess"),
  playerapi: require('./app'),
  cardtypes: require('./definitions/cardtypes'),
  start: (config) => {
    const fs = require('fs');
    const path = require('path');
    const _ = require("lodash");

    let strategyFolder = _.get(config, "strategyFolder", path.dirname(require.main.filename) + "/strategy/");
    let port = _.get(config, "port", 8080);
    let enableLogging = _.get(config, "enableLogging", false);

    let app = require('./app.js');

    let strategies = [];
    let files = fs.readdirSync(strategyFolder);
    files.forEach(file => strategies.push(require(strategyFolder + file)));
    app.start(port, enableLogging, strategies);
  }
};

