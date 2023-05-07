import { expect } from "chai";
import { Card } from "../src/card";
import { Game } from "../src/game";
import {
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "../src/ckeck_card_pattern_handler";

import {
  SingleCompareCardStrategy,
  PairCompareCardStrategy,
  StraightCompareCardStrategy,
  FullHouseCompareCardStrategy,
} from "../src/compare_card_strategy";

describe("test CheckSingleCardPatternHandler", () => {
  it("check card pattern, match", () => {
    const handler = new CheckSingleCardPatternHandler(null);
    const card = new Card("D", "3");

    const result = handler.checkCardPattern([card]);
    expect(result).to.be.true;
  });

  it("check card pattern, not match", () => {
    const handler = new CheckSingleCardPatternHandler(null);
    const card_1 = new Card("D", "9");
    const card_2 = new Card("D", "2");

    const result = handler.checkCardPattern([card_1, card_2]);
    expect(result).to.be.false;
  });

  it("check top play card pattern and set game compare strategy", () => {
    const handler = new CheckSingleCardPatternHandler(null);
    const game = new Game();
    const cards = [new Card("D", "3")];

    handler.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);

    expect(game.compareCardStrategy instanceof SingleCompareCardStrategy).to.be
      .true;
  });
});

describe("test CheckPairCardPatternHandler", () => {
  it("check card pattern, match", () => {
    const handler = new CheckPairCardPatternHandler(null);
    const card_1 = new Card("D", "9");
    const card_2 = new Card("H", "9");

    const result = handler.checkCardPattern([card_1, card_2]);
    expect(result).to.be.true;
  });

  it("check card pattern, card amount didn't match", () => {
    const handler = new CheckPairCardPatternHandler(null);
    const card = new Card("D", "9");

    const result = handler.checkCardPattern([card]);
    expect(result).to.be.false;
  });

  it("check card pattern, card rank didn't match", () => {
    const handler = new CheckPairCardPatternHandler(null);
    const card_1 = new Card("D", "8");
    const card_2 = new Card("D", "9");

    const result = handler.checkCardPattern([card_1, card_2]);
    expect(result).to.be.false;
  });

  it("check top play card pattern and set game compare strategy", () => {
    const handler = new CheckPairCardPatternHandler(null);
    const game = new Game();
    const cards = [new Card("D", "3"), new Card("H", "3")];

    handler.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);

    expect(game.compareCardStrategy instanceof PairCompareCardStrategy).to.be
      .true;
  });
});

describe("test CheckStraightCardPatternHandler", () => {
  it("check card pattern, match", () => {
    const handler = new CheckStraightCardPatternHandler(null);
    const cards = [
      new Card("D", "3"),
      new Card("D", "4"),
      new Card("D", "5"),
      new Card("D", "6"),
      new Card("D", "7"),
    ];

    const result = handler.checkCardPattern(cards);
    expect(result).to.be.true;
  });

  it("check card pattern, card amount didn't match", () => {
    const handler = new CheckStraightCardPatternHandler(null);
    const card = new Card("D", "9");

    const result = handler.checkCardPattern([card]);
    expect(result).to.be.false;
  });

  it("check card pattern, card rank didn't match", () => {
    const handler = new CheckStraightCardPatternHandler(null);
    const cards = [
      new Card("D", "3"),
      new Card("D", "8"),
      new Card("D", "5"),
      new Card("D", "6"),
      new Card("D", "7"),
    ];

    const result = handler.checkCardPattern(cards);
    expect(result).to.be.false;
  });

  it("check top play card pattern and set game compare strategy", () => {
    const handler = new CheckStraightCardPatternHandler(null);
    const game = new Game();
    const cards = [
      new Card("D", "3"),
      new Card("D", "4"),
      new Card("D", "5"),
      new Card("D", "6"),
      new Card("D", "7"),
    ];

    handler.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);

    expect(game.compareCardStrategy instanceof StraightCompareCardStrategy).to
      .be.true;
  });
});

describe("test CheckFullHouseCardPatternHandler", () => {
  it("check card pattern, match", () => {
    const handler = new CheckFullHouseCardPatternHandler(null);
    const cards = [
      new Card("D", "3"),
      new Card("C", "3"),
      new Card("H", "3"),
      new Card("D", "6"),
      new Card("S", "6"),
    ];

    const result = handler.checkCardPattern(cards);
    expect(result).to.be.true;
  });

  it("check card pattern, card amount didn't match", () => {
    const handler = new CheckFullHouseCardPatternHandler(null);
    const card = new Card("D", "9");

    const result = handler.checkCardPattern([card]);
    expect(result).to.be.false;
  });

  it("check card pattern, card rank didn't match", () => {
    const handler = new CheckFullHouseCardPatternHandler(null);
    const cards = [
      new Card("D", "3"),
      new Card("H", "3"),
      new Card("S", "6"),
      new Card("D", "6"),
      new Card("D", "7"),
    ];

    const result = handler.checkCardPattern(cards);
    expect(result).to.be.false;
  });

  it("check top play card pattern and set game compare strategy", () => {
    const handler = new CheckFullHouseCardPatternHandler(null);
    const game = new Game();
    const cards = [
      new Card("D", "3"),
      new Card("S", "6"),
      new Card("D", "6"),
      new Card("H", "6"),
      new Card("H", "3"),
    ];

    handler.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);

    expect(game.compareCardStrategy instanceof FullHouseCompareCardStrategy).to
      .be.true;
  });
});
