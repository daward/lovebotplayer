/**
 * Creates a list of strategies loaded from a directory
 */
const fs = require('fs');
const path = require('path');
const _ = require("lodash");

module.exports = (config) => {
  let strategyFolder = path.join(path.dirname(require.main.filename),
     _.get(config, "strategyFolder", "strategies/"));

  let strategies = [];
  if (fs.existsSync(strategyFolder)) {
    let files = fs.readdirSync(strategyFolder);
    files.forEach(file => strategies.push({
      name: file.replace(".js", ""),
      strategy: require(path.join(strategyFolder, file))
    }));
  }
  return strategies;
};