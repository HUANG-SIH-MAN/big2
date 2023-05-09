import { expect } from "chai";
import { Card } from "../src/card";
import {
  SinglCardPatternStrategy,
  PairCardPatternStrategy,
  StraightCardPatternStrategy,
  FullHousePatternStrategy,
} from "../src/compare_card_strategy";

import {
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "../src/ckeck_card_pattern_handler";

describe("test SinglCardPatternStrategy", () => {
  it("basic", () => {
    const strategy = new SinglCardPatternStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof CheckSingleCardPatternHandler
    ).to.be.true;

    expect(strategy.cardPatternName).to.be.equal("單張");
  });

  it("findTheBigCard", () => {
    const strategy = new SinglCardPatternStrategy();
    const card = new Card("D", "3");

    // @ts-ignore
    const result = strategy.findTheBigCard([card]);
    expect(result).to.be.equal(card);
  });

  it("checkCardsBigThanTopPlay", () => {
    const strategy = new SinglCardPatternStrategy();
    const card = new Card("D", "3");
    const top_card = new Card("D", "9");

    const result = strategy.checkCardsBigThanTopPlay([card], [top_card]);
    expect(result).to.be.false;
  });

  it("AIPlayCard: pass", () => {
    const strategy = new SinglCardPatternStrategy();
    const hand_card = [
      new Card("D", "3"),
      new Card("H", "4"),
      new Card("S", "8"),
    ];
    const top_play = [new Card("S", "2")];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: play card", () => {
    const strategy = new SinglCardPatternStrategy();
    const target_card = new Card("H", "7");
    const hand_card = [new Card("D", "3"), target_card, new Card("S", "8")];
    const top_play = [new Card("S", "6")];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result.length).to.be.equal(1);
    expect(result[0]).to.be.equal(target_card);
  });
});

describe("test PairCardPatternStrategy", () => {
  it("basic", () => {
    const strategy = new PairCardPatternStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof CheckPairCardPatternHandler
    ).to.be.true;
    expect(strategy.cardPatternName).to.be.equal("對子");
  });

  it("findTheBigCard", () => {
    const strategy = new PairCardPatternStrategy();
    const card_1 = new Card("D", "6");

    const card_2 = new Card("H", "6");
    // @ts-ignore
    const result = strategy.findTheBigCard([card_1, card_2]);
    expect(result).to.be.equal(card_2);
  });

  it("checkCardsBigThanTopPlay", () => {
    const strategy = new PairCardPatternStrategy();
    const cards = [new Card("D", "8"), new Card("H", "8")];
    const top_play = [new Card("D", "7"), new Card("H", "7")];

    const result = strategy.checkCardsBigThanTopPlay(cards, top_play);
    expect(result).to.be.true;
  });

  it("AIPlayCard: pass because of card amount", () => {
    const strategy = new PairCardPatternStrategy();
    const hand_card = [new Card("D", "8")];
    const top_play = [new Card("C", "7"), new Card("S", "7")];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: pass because of no suitable card", () => {
    const strategy = new PairCardPatternStrategy();
    const hand_card = [
      new Card("D", "5"),
      new Card("H", "5"),
      new Card("C", "6"),
    ];
    const top_play = [new Card("S", "7"), new Card("C", "7")];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: play card", () => {
    const strategy = new PairCardPatternStrategy();
    const target_card_1 = new Card("D", "5");
    const target_card_2 = new Card("H", "5");
    const hand_card = [
      target_card_1,
      target_card_2,
      new Card("C", "6"),
      new Card("S", "6"),
    ];
    const top_play = [new Card("C", "3"), new Card("S", "3")];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result.length).to.be.equal(2);
    expect(result).to.be.eql([target_card_1, target_card_2]);
  });
});

describe("test StraightCardPatternStrategy", () => {
  it("basic", () => {
    const strategy = new StraightCardPatternStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof
        CheckStraightCardPatternHandler
    ).to.be.true;
    expect(strategy.cardPatternName).to.be.equal("順子");
  });

  it("findTheBigCard", () => {
    const strategy = new StraightCardPatternStrategy();
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
    const strategy = new StraightCardPatternStrategy();
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

  it("AIPlayCard: pass because of card amount", () => {
    const strategy = new StraightCardPatternStrategy();
    const hand_card = [new Card("D", "8")];
    const top_play = [
      new Card("C", "7"),
      new Card("S", "8"),
      new Card("C", "9"),
      new Card("S", "10"),
      new Card("C", "J"),
    ];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: pass because of no suitable card", () => {
    const strategy = new StraightCardPatternStrategy();
    const hand_card = [
      new Card("C", "3"),
      new Card("S", "3"),
      new Card("C", "4"),
      new Card("S", "5"),
      new Card("C", "6"),
      new Card("S", "7"),
      new Card("C", "J"),
      new Card("S", "Q"),
      new Card("C", "K"),
    ];
    const top_play = [
      new Card("C", "7"),
      new Card("S", "8"),
      new Card("C", "9"),
      new Card("S", "10"),
      new Card("C", "J"),
    ];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: play card", () => {
    const strategy = new StraightCardPatternStrategy();
    const target_card_1 = new Card("C", "9");
    const target_card_2 = new Card("S", "10");
    const target_card_3 = new Card("C", "J");
    const target_card_4 = new Card("S", "Q");
    const target_card_5 = new Card("S", "K");
    const hand_card = [
      new Card("C", "5"),
      new Card("S", "6"),
      new Card("C", "7"),
      new Card("S", "8"),
      target_card_1,
      target_card_2,
      target_card_3,
      target_card_4,
      target_card_5,
    ];
    const top_play = [
      new Card("C", "7"),
      new Card("S", "8"),
      new Card("C", "9"),
      new Card("S", "10"),
      new Card("C", "J"),
    ];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result.length).to.be.equal(5);
    expect(result).to.be.eql([
      target_card_5,
      target_card_4,
      target_card_3,
      target_card_2,
      target_card_1,
    ]);
  });
});

describe("test FullHousePatternStrategy", () => {
  it("basic", () => {
    const strategy = new FullHousePatternStrategy();

    expect(
      strategy.checkCardPatternHandler instanceof
        CheckFullHouseCardPatternHandler
    ).to.be.true;
    expect(strategy.cardPatternName).to.be.equal("葫蘆");
  });

  it("findTheBigCard", () => {
    const strategy = new FullHousePatternStrategy();
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
    const strategy = new FullHousePatternStrategy();
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

  it("AIPlayCard: pass because of card amount", () => {
    const strategy = new FullHousePatternStrategy();
    const hand_card = [new Card("D", "8")];
    const top_play = [
      new Card("C", "Q"),
      new Card("S", "Q"),
      new Card("C", "3"),
      new Card("H", "3"),
      new Card("S", "3"),
    ];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: pass because of no suitable card", () => {
    const strategy = new FullHousePatternStrategy();
    const hand_card = [
      new Card("C", "10"),
      new Card("H", "10"),
      new Card("S", "10"),
      new Card("C", "A"),
      new Card("S", "A"),
    ];
    const top_play = [
      new Card("C", "Q"),
      new Card("S", "Q"),
      new Card("C", "K"),
      new Card("H", "K"),
      new Card("S", "K"),
    ];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result).to.be.empty;
  });

  it("AIPlayCard: play card", () => {
    const strategy = new FullHousePatternStrategy();
    const target_card_1 = new Card("C", "10");
    const target_card_2 = new Card("H", "10");
    const target_card_3 = new Card("C", "2");
    const target_card_4 = new Card("H", "2");
    const target_card_5 = new Card("S", "2");

    const hand_card = [
      target_card_1,
      target_card_2,
      new Card("C", "11"),
      new Card("S", "11"),
      new Card("C", "K"),
      new Card("D", "K"),
      new Card("H", "K"),
      target_card_3,
      target_card_4,
      target_card_5,
    ];
    const top_play = [
      new Card("C", "Q"),
      new Card("S", "Q"),
      new Card("C", "K"),
      new Card("H", "K"),
      new Card("S", "K"),
    ];

    const result = strategy.AIPlayCard(hand_card, top_play);
    expect(result.length).to.be.equal(5);
    expect(result).to.be.eql([
      target_card_3,
      target_card_4,
      target_card_5,
      target_card_1,
      target_card_2,
    ]);
  });
});
