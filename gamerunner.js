/**
 * Creates a tournament on a server, loading the strategies that are hosted locally
 */
const rp = require("request-promise");
const _ = require("lodash");

module.exports = (config) => {
  mergeDefaults(config);
  return startGame(config);
};

let startGame = (config) => {
  // build the options to run the game
  let options = {
    method: "POST",
    json: {
      players: config.players,
      numberOfMatches: config.numberOfMatches,
      gamesPerMatch: config.gamesPerMatch
    },
    uri: config.serverUrl + "/api/tournament"
  };  

  return rp(options);
};

let mergeDefaults = (config) => {
  if (!config.players) {
    config.players = [];
  }

  _.forEach(config.strategies, strategy => {
    config.players.push({
      name: strategy.name,
      aiType: "httpproxy",
      strategyUri: `http://127.0.0.1:8080/api/strategies/${strategy.name}`
    });
  });

  // then fill it out with random players
  while (config.players.length < 4) {
    config.players.push({
      name: `Auto ${config.players.length}`,
      aiType: "goodguess"
    });
  }

  // if no server is set, then assume we mean the main controller
  if (!config.serverUrl) {
    config.serverUrl = "https://lovebot-runner.herokuapp.com";
  }

  config.numberOfMatches = config.numberOfMatches || 50;
  config.gamesPerMatch = config.gamesPerMatch || 4;
};