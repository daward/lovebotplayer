const cardtypes = require("../../definitions/cardtypes");
const _ = require("lodash");

module.exports = (targetCard, possibilities) => {
  if (targetCard.name !== cardtypes.king.name) {
    return possibilities;
  }

  // if the target is the one we're making possibilities
  // for, then they have the card of the targeter
  if (targetCard.target === targetCard.audienceId) {
    return [targetCard.playerCard];
  }

  if (targetCard.playerId === targetCard.audienceId) {
    return [targetCard.targetCard];
  }

  return possibilities;
};