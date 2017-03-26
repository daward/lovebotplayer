const _ = require("lodash");
module.exports = (opponents) => {
  return _.filter(opponents, opponent => opponent.active && !opponent.protected);
};