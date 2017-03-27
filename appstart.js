/**
 * Starts a lovebot from a configuration
 */
module.exports = (config) => {
  const strategies = require("./strategyloader")(config);
  const _ = require("lodash");
  const app = require('./app.js');
  app.start(
    _.get(config, "port", 8080),
    _.get(config, "enableLogging", false),
    strategies);

  return strategies;
}