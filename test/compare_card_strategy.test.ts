import { expect } from "chai";
import { Card } from "../src/card";
import {
  SingleCompareCardStrategy,
  PairCompareCardStrategy,
  StraightCompareCardStrategy,
  FullHouseCompareCardStrategy,
} from "../src/compare_card_strategy";

import {
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "../src/ckeck_card_pattern_handler";

describe("test SingleCompareCardStrategy", () => {
  it("basic", () => {
    const strategy = new SingleCompareCardStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof CheckSingleCardPatternHandler
    ).to.be.true;

    expect(strategy.cardPatternName).to.be.equal("單張");
  });

  it("findTheBigCard", () => {
    const strategy = new SingleCompareCardStrategy();
    const card = new Card("D", "3");

    // @ts-ignore
    const result = strategy.findTheBigCard([card]);
    expect(result).to.be.equal(card);
  });

  it("checkCardsBigThanTopPlay", () => {
    const strategy = new SingleCompareCardStrategy();
    const card = new Card("D", "3");
    const top_card = new Card("D", "9");

    const result = strategy.checkCardsBigThanTopPlay([card], [top_card]);
    expect(result).to.be.false;
  });
});

describe("test PairCompareCardStrategy", () => {
  it("basic", () => {
    const strategy = new PairCompareCardStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof CheckPairCardPatternHandler
    ).to.be.true;
    expect(strategy.cardPatternName).to.be.equal("對子");
  });

  it("findTheBigCard", () => {
    const strategy = new PairCompareCardStrategy();
    const card_1 = new Card("D", "6");

    const card_2 = new Card("H", "6");
    // @ts-ignore
    const result = strategy.findTheBigCard([card_1, card_2]);
    expect(result).to.be.equal(card_2);
  });

  it("checkCardsBigThanTopPlay", () => {
    const strategy = new PairCompareCardStrategy();
    const cards = [new Card("D", "8"), new Card("H", "8")];
    const top_play = [new Card("D", "7"), new Card("H", "7")];

    const result = strategy.checkCardsBigThanTopPlay(cards, top_play);
    expect(result).to.be.true;
  });
});

describe("test StraightCompareCardStrategy", () => {
  it("basic", () => {
    const strategy = new StraightCompareCardStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof
        CheckStraightCardPatternHandler
    ).to.be.true;
    expect(strategy.cardPatternName).to.be.equal("順子");
  });

  it("findTheBigCard", () => {
    const strategy = new StraightCompareCardStrategy();
    const big_card = new Card("D", "10");

    // @ts-ignore
    const result = strategy.findTheBigCard([
      new Card("D", "9"),
      big_card,
      new Card("D", "8"),
      new Card("D", "7"),
      new Card("D", "6"),
    ]);
    expect(result).to.be.equal(big_card);
  });

  it("checkCardsBigThanTopPlay", () => {
    const strategy = new StraightCompareCardStrategy();
    const cards = [
      new Card("C", "3"),
      new Card("H", "4"),
      new Card("S", "5"),
      new Card("D", "6"),
      new Card("H", "7"),
    ];
    const top_play = [
      new Card("H", "3"),
      new Card("D", "4"),
      new Card("D", "5"),
      new Card("C", "6"),
      new Card("C", "7"),
    ];

    const result = strategy.checkCardsBigThanTopPlay(cards, top_play);
    expect(result).to.be.true;
  });
});

describe("test FullHouseCompareCardStrategy", () => {
  it("basic", () => {
    const strategy = new FullHouseCompareCardStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof
        CheckFullHouseCardPatternHandler
    ).to.be.true;
    expect(strategy.cardPatternName).to.be.equal("葫蘆");
  });

  it("findTheBigCard", () => {
    const strategy = new FullHouseCompareCardStrategy();
    const big_card = new Card("S", "10");

    // @ts-ignore
    const result = strategy.findTheBigCard([
      new Card("D", "9"),
      big_card,
      new Card("H", "9"),
      new Card("D", "10"),
      new Card("C", "10"),
    ]);
    expect(result).to.be.equal(big_card);
  });

  it("checkCardsBigThanTopPlay", () => {
    const strategy = new FullHouseCompareCardStrategy();
    const cards = [
      new Card("C", "3"),
      new Card("H", "3"),
      new Card("S", "10"),
      new Card("D", "10"),
      new Card("H", "10"),
    ];
    const top_play = [
      new Card("H", "Q"),
      new Card("D", "Q"),
      new Card("D", "7"),
      new Card("C", "7"),
      new Card("H", "7"),
    ];

    const result = strategy.checkCardsBigThanTopPlay(cards, top_play);
    expect(result).to.be.true;
  });
});
