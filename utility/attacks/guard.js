const cardtypes = require("../../definitions/cardtypes");
const _ = require("lodash");

module.exports = (targetCard, possibilities) => {
  if (targetCard.name !== cardtypes.guard.name) {
    return possibilities;
  }
  return _.filter(possibilities, possibleCard => possibleCard !== targetCard.guess);
};