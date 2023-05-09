import { Game } from "./game";
import { Card } from "./card";
import {
  CardPatternStrategy,
  SinglCardPatternStrategy,
  PairCardPatternStrategy,
  StraightCardPatternStrategy,
  FullHousePatternStrategy,
} from "./card_pattern_strategy";

export abstract class CheckCardPatternHandler {
  protected next: CheckCardPatternHandler | null;
  protected abstract strategy: CardPatternStrategy;

  constructor(next: CheckCardPatternHandler | null) {
    this.next = next;
  }

  public checkTopPlayCardPatternAndSetGameCompareStrategy(
    cards: Card[],
    game: Game
  ) {
    if (this.strategy.checkCardPattern(cards)) {
      game.compareCardStrategy = this.strategy;
      game.topPlay = cards;
    } else {
      this.next?.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);
    }
  }
}

export class CheckSingleCardPatternHandler extends CheckCardPatternHandler {
  protected strategy = new SinglCardPatternStrategy();
}

export class CheckPairCardPatternHandler extends CheckCardPatternHandler {
  protected strategy = new PairCardPatternStrategy();
}

export class CheckStraightCardPatternHandler extends CheckCardPatternHandler {
  protected strategy = new StraightCardPatternStrategy();
}

export class CheckFullHouseCardPatternHandler extends CheckCardPatternHandler {
  protected strategy = new FullHousePatternStrategy();
}
