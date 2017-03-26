const cardtypes = require("../../definitions/cardtypes");
const _ = require("lodash");

module.exports = (targetCard, possibilities) => {
  if (targetCard.name !== cardtypes.baron.name) {
    return possibilities;
  }

  if (targetCard.result === "fail" || targetCard.result === "success") {
    let loser = cardtypes[targetCard.losingCard].value;
    return _.filter(possibilities, possibleCard => cardtypes[possibleCard].value > loser);
    // if there was a baron draw, then we know there must be two of this card remaining
  } else if (targetCard.result === "draw") {
    let counts = _.countBy(possibilities);
    let multis = _.keys(_.pickBy(counts, value => value >= 2));
    return _.filter(possibilities, possibleCard => _.includes(multis, possibleCard));
    // a null-play would have no result
  } else {
    return possibilities;
  }
};