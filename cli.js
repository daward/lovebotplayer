const strategyLoader = require("./strategyloader");
const gameRunner = require("./gamerunner");
const parseArgs = require("minimist");
const exportedApi = require("./index");

let args = parseArgs(process.argv);
let strategies = exportedApi.start({
  strategyFolder: args.strategyFolder
});

gameRunner({
  serverUrl: args.server,
  strategies: strategies,
  numberOfMatches: args.numberOfMatches
})
  .then(results => console.log(results))
  .then(() => process.exit(0));