const _ = require("lodash");
const cardtypes = require("../definitions/cardtypes");

class CardModel {
  constructor(cards) {
    this.cards = cards;
  }

  are(card1name, card2name) {
    return _.filter(this.cards, card => card.name === card1name).length &&
      _.filter(this.cards, card => card.name === card2name).length;
  }

  has(cardName) {
    return _.filter(this.cards, card => card.name === cardName).length > 0;
  }

  only(cardName) {
    return new CardModel(_.filter(this.cards, card => card.name === cardName));
  }

  except(cardName) {
    return new CardModel(_.filter(this.cards, card => card.name !== cardName));
  }

  other(cardName) {
    if (this.cards[0].name === cardName) {
      return new CardModel([this.cards[1]]);
    } else if (this.cards[1].name === cardName) {
      return new CardModel([this.cards[0]]);
    } else {
      throw new Error("You don't even have that card, dummy");
    }
  }

  swapped() {
    // you could never have more than one card that was swapped
    // because there is only one king in the game to swap cards
    return _.find(this.cards, card => card.swap);
  }

  names() {
    return _.map(this.cards, "name");
  }

  legalPlays() {
    if (this.are("countess", "prince") || this.are("countess", "king")) {
      return this.only("countess");
    } else {
      return this;
    }
  }

  selectedPlay(selected, targetSelector, guessSelector) {
    let cardType = cardtypes[selected];
    let play = { selected };

    if (_.includes(cardType.fields, "target")) {
      _.set(play, "cardParameters.target", targetSelector(cardType));
    }

    if (_.includes(cardType.fields, "guess")) {
      _.set(play, "cardParameters.guess", guessSelector());
    }
    return play;
  }

  randomPlay(targetSelector, guessSelector) {
    let selected = _.sample(this.legalPlays().cards).name;
    return this.selectedPlay(selected, targetSelector, guessSelector);
  }
}

module.exports = CardModel;