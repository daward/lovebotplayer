const _ = require("lodash");
const cardtypes = require("../definitions/cardtypes");
const OpponentModel = require("../utility/opponentmodel");
const CardModel = require("../utility/cardmodel");

module.exports = (player, opponents) => {

  player.cards = new CardModel(player.cards);
  let opponentModel = new OpponentModel(player, opponents);

  return player.cards.except(cardtypes.princess.name).randomPlay(
    () => opponentModel.randomOpponentId(),
    () => _.sample(_.filter(opponentModel.cardsRemaining(), card => card !== cardtypes.guard.name)));
};