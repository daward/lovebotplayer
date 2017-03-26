const cardtypes = require("../../definitions/cardtypes");
const _ = require("lodash");

module.exports = (targetCard, possibilities) => {
  if(targetCard.name !== cardtypes.priest.name || !targetCard.result) {
    return possibilities;
  }
  
  return _.filter(possibilities, possibleCard => possibleCard === targetCard.result);
};