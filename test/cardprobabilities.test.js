const OpponentModel = require("../utility/opponentmodel");
const expect = require("chai").expect;
const chai = require("chai");
const _ = require("lodash");

let makeModel = (gamePath) =>
  new OpponentModel(
    _.cloneDeep(require(`${gamePath}/player`)),
    _.cloneDeep(require(`${gamePath}/opponents`)));

describe("Card probability tests", function () {

  beforeEach(() => {
    this.ctx.model = makeModel("./data");
  });

  it("Should correctly report what cards it knows about", () => {
    expect(_.map(this.ctx.model.knownCards(), "name"))
      .to.eql(['guard', 'handmaid', 'handmaid', 'guard', 'priest', 'guard']);
  });

  it("Should report based on what it knows exists", () => {
    expect(this.ctx.model.possibleCardsForOpponent("Auto 1"))
      .to.eql(['guard',
        'guard',
        'priest',
        'baron',
        'baron',
        'prince',
        'prince',
        'king',
        'countess',
        'princess']);
  });

  it("Should incorporate recent failed guard knowledge", () => {
    // to note, this has to be reassessed after the player in question
    // plays another card.  He's not the prince right now, but he could
    // become the prince
    expect(this.ctx.model.possibleCardsForOpponent("Auto 2"))
      .to.eql(['guard',
        'guard',
        'priest',
        'baron',
        'baron',
        'king',
        'countess',
        'princess']);
  });

  describe("Baron game scenario", function () {
    beforeEach(() => {
      this.ctx.model = makeModel("./data/game2");
    });

    it("Should incorporate recent baron knowledge (attack resulted in a draw)", () => {
      expect(this.ctx.model.possibleCardsForOpponent("Auto 2"))
        .to.eql(['guard', 'guard', 'guard', 'guard', 'prince', 'prince']);
    });

    it("Should incorporate recent baron knowledge (attack failed)", () => {
      this.ctx.model.opponents[2].plays[0].result = "fail";
      expect(this.ctx.model.possibleCardsForOpponent("Auto 2"))
        .to.eql(['handmaid', 'prince', 'prince', 'countess', 'princess']);
    });

    it("Should incorporate recent baron knowledge (attack succeeded)", () => {
      this.ctx.model.opponents[2].plays[0].result = "success";
      expect(this.ctx.model.possibleCardsForOpponent("Auto 3"))
        .to.eql(['handmaid', 'prince', 'prince', 'countess', 'princess']);
    });

    it("Should incorporate recent baron knowledge (by attacking player that resulted in a draw)", () => {
      this.ctx.model.opponents[2].plays[0].result = "draw";
      expect(this.ctx.model.possibleCardsForOpponent("Auto 3"))
        .to.eql(['guard', 'guard', 'guard', 'guard', 'prince', 'prince']);
    });
  });

  describe("Priest game scenario", function () {
    beforeEach(() => {

      this.ctx.model = makeModel("./data/game2");
      this.ctx.model.player.plays[0] = {
        name: "priest",
        value: 2,
        target: "Auto 2",
        result: "guard",
        turn: 0
      };

      this.ctx.model.opponents[2].plays[0] = {
        name: "handmaid",
        value: 4,
        turn: 1
      }
    });

    it("Should incorporate recent priest knowledge", () => {
      expect(this.ctx.model.possibleCardsForOpponent("Auto 2"))
        .to.eql(['guard', 'guard', 'guard', 'guard', 'guard']);
    });

    it("Should incorporate past knowledge where appropriate", () => {
      this.ctx.model.opponents[1].plays[0] = {
        name: "priest",
        value: 2,
        target: "Auto 1",
        result: "guard",
        turn: 3
      };
      expect(this.ctx.model.possibleCardsForOpponent("Auto 2"))
        .to.eql(['guard', 'guard', 'guard', 'guard', 'guard']);
    });

    it("Should not incorporate past knolwedge when invalid", () => {
      this.ctx.model.opponents[1].plays[0] = {
        name: "guard",
        value: 1,
        target: "Auto 1",
        guess: "countess",
        result: "fail",
        turn: 3
      };
      expect(this.ctx.model.possibleCardsForOpponent("Auto 2"))
        .to.eql(this.ctx.model.cardsRemaining());
    });
  });

  // the king is complicated.  If it involves you, you now know exactly what the other player has
  // because you had it.  However, if it doesn't involve you, now you have to switch the possibilities
  // you had come up with for one player with another player.  Unlike some of the other cards, the turn
  // it was played in makes a big difference, as it does not just represent a decay of knolwedge, but
  // when your knowledge was totally switched
  describe("King game scenario", function () {

    beforeEach(() => {
      this.ctx.model = makeModel("./data/kinggame");
    });

    it("Should correctly apply transfered knowledge", () => {
      expect(this.ctx.model.possibleCardsForOpponent("Auto 3"))
        .to.not.contain("priest");
    });

    it("Should correctly remove transfered knowledge", () => {
      expect(this.ctx.model.possibleCardsForOpponent("Auto 1"))
        .to.eql(this.ctx.model.cardsRemaining());
    });

    it("Should correctly apply knowledge after the swap", () => {
      this.ctx.model.opponents[1].plays[0] = {
        name: "guard",
        value: 1,
        target: "Auto 1",
        guess: "countess",
        result: "fail",
        turn: 3
      };
      expect(this.ctx.model.possibleCardsForOpponent("Auto 1"))
        .to.not.contain("countess");
    });
  });
});