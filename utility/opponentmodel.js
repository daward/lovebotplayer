const _ = require("lodash");
const cardtypes = require("../definitions/cardtypes");

class OpponentModel {
  constructor(player, opponents) {
    this.player = player;
    this.opponents = opponents;
  }

  /**
   * Represents all the cards that are on the table
   */
  playedCards() {
    let opponentPlays =
      _.flatten(_.map(this.opponents, opponent => {
        _.forEach(opponent.plays, play => {
          play.playerId = opponent.id;
        });
        return opponent.plays;
      }));

    // then label your own cards with your id
    _.forEach(this.player.plays, play => play.playerId = this.player.id);

    // add your plays and the opponets plays together
    return _.sortBy(_.concat(opponentPlays, this.player.plays), "turn");
  }

  /**
   * Represents all the cards that are known to the player
   */
  knownCards() {
    // the known cards are the played cards, plus what you have in your hand
    return _.concat(this.playedCards(), this.player.cards.cards);
  }

  /**
   * The opponents that can be targeted
   */
  validTargets() {
    return _.filter(this.opponents, opponent => opponent.active && !opponent.protected);
  }

  /**
   * Determines if a specific opponent is a valid target
   * @param {any} playerId 
   */
  isValidTarget(playerId) {
    return _.find(this.validTargets(), target => target.id === playerId);
  }

  /**
   * Returns a randomly selected opponent that is valid to target
   */
  randomOpponentId() {
    let opponent = _.sample(this.validTargets());
    if (!opponent) {
      return this.player.id;
    } else {
      return opponent.id;
    }
  }

  opponent(opponentId) {
    return _.find(this.opponents, opponent => opponent.id === opponentId);
  }

  /**
   * The cards that are still at-large in the game
   */
  cardsRemaining() {
    // count each kind of card that has been plaed
    let cardsPlayed = _.countBy(this.knownCards(), play => play.name);

    // then push one for each instance that remains
    let cardsRemaining = [];
    _.forIn(cardtypes, (value, key) => {
      var left = value.quantity - (cardsPlayed[key] || 0);
      _.times(left, () => cardsRemaining.push(key));
    });

    return cardsRemaining;
  }

  priestsPlayed() {
    return _.filter(this.player.plays,
      play => play.name === cardtypes.priest.name && play.result);
  }

  /**
   * Reports all the cards that a opponent has played since a specific turn.
   * This is particularly useful to know after a king swap, a priest, or a baron
   * @param {any} turn 
   * @param {any} opponentId 
   */
  cardsSinceTurnByOpponent(turn, opponentId) {
    return _.filter(this.knownCards(),
      card => card.turn > turn && card.playerId === opponentId);
  }

  /**
   * Gets the king swap play if one was made involving this player
   * @param {*} opponentId 
   */
  getKingSwap(opponentId) {
    let kingSwap = _.find(this.playedCards(), card =>
      card.name === cardtypes.king.name && (card.target === opponentId || card.playerId === opponentId));

    if(kingSwap) {
      kingSwap.audienceId = this.playerId;
      return kingSwap;
    }
  }

  filterPossibilities(possibilities, opponentId) {
    // cards that target another are the ones that provide information
    let attackFilter = (targetCards, attacks) => {
      // look for attacks on this player
      _.forEach(targetCards, targetCard => {
        let originalPossibilities = possibilities;
        _.forEach(attacks, attack => {
          possibilities = attack(targetCard, possibilities);
          let cardsSinceAttack = this.cardsSinceTurnByOpponent(targetCard.turn, opponentId);

          // get the cards since a king was played
          let cardsSinceAttackOrSwap = _.takeWhile(cardsSinceAttack, card => card.name != cardtypes.king.name);

          // if the cards they have played since the attack don't fit with what we know they have,
          // then we know those were cards drawn since the attack, and our information is still valid.
          // However, if they have played a card that is currently one of the possibilities we have
          // for them, our knowledge is nullified
          if (_.intersection(_.map(cardsSinceAttackOrSwap, "name"), possibilities).length) {
            possibilities = originalPossibilities;
          }
        });
      });

      return possibilities;
    };

    let playedCards = this.playedCards();
    // now we'll re-orient the cards to reflect a potential king swap, 
    // this means we'll change the targets of all the cards to the other player in the swap
    let kingSwap = this.getKingSwap(opponentId);
    if (kingSwap) {
      _.forEach(playedCards, card => {
        if (card.target === kingSwap.target && card.turn < kingSwap.turn) {
          card.target = kingSwap.playerId;
        } else if (card.target === kingSwap.playerId && card.turn < kingSwap.turn) {
          card.target = kingSwap.target;
        }
      });
    }
    // look for attacks against the given player
    possibilities = attackFilter(
      _.filter(playedCards, card => card.target === opponentId),
      [
        require("./attacks/baron"),
        require("./attacks/guard"),
        require("./attacks/priest"),
        require("./attacks/king")
      ]);
    // now look for attacks by this player
    possibilities = attackFilter(
      _.filter(playedCards, card => card.target && card.playerId === opponentId),
      [
        require("./attacks/baron"),
        require("./attacks/king")
      ]);

    return possibilities;
  }

  possibleCardsForOpponent(opponentId) {
    // starting with the cards remaining, for the given opponent,
    // figure out what possible cards they could be holding
    return this.filterPossibilities(this.cardsRemaining(), opponentId);
  }

  possibleCards() {
    let retVal = {};
    _.forEach(this.validTargets(), opponent => {
      let possibilities = this.possibleCardsForOpponent(opponent.id);
      
      retVal[opponent.id] = possibilities;
    });
    return retVal;
  }
}

module.exports = OpponentModel;