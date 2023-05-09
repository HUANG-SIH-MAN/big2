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
  SinglCardPatternStrategy,
  PairCardPatternStrategy,
  StraightCardPatternStrategy,
  FullHousePatternStrategy,
} from "../src/card_pattern_strategy";

describe("test CheckSingleCardPatternHandler", () => {
  it("check top play card pattern and set game compare strategy", () => {
    const handler = new CheckSingleCardPatternHandler(null);
    const game = new Game();
    const cards = [new Card("D", "3")];

    handler.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);

    expect(game.compareCardStrategy instanceof SinglCardPatternStrategy).to.be
      .true;
  });
});

describe("test CheckPairCardPatternHandler", () => {
  it("check top play card pattern and set game compare strategy", () => {
    const handler = new CheckPairCardPatternHandler(null);
    const game = new Game();
    const cards = [new Card("D", "3"), new Card("H", "3")];

    handler.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);

    expect(game.compareCardStrategy instanceof PairCardPatternStrategy).to.be
      .true;
  });
});

describe("test CheckStraightCardPatternHandler", () => {
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

    expect(game.compareCardStrategy instanceof FullHousePatternStrategy).to.be
      .true;
  });
});
