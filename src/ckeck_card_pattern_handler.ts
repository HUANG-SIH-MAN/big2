import { Game } from "./game";
import { Card } from "./card";
import {
  SinglCardPatternStrategy,
  PairCardPatternStrategy,
  StraightCardPatternStrategy,
  FullHousePatternStrategy,
} from "./compare_card_strategy";

export abstract class CheckCardPatternHandler {
  protected next: CheckCardPatternHandler | null;

  constructor(next: CheckCardPatternHandler | null) {
    this.next = next;
  }

  public checkTopPlayCardPatternAndSetGameCompareStrategy(
    cards: Card[],
    game: Game
  ) {
    if (this.checkCardPattern(cards)) {
      this.setGameCompareCardStrategy(game);
      game.topPlay = cards;
    } else {
      this.next?.checkTopPlayCardPatternAndSetGameCompareStrategy(cards, game);
    }
  }

  abstract checkCardPattern(cards: Card[]): boolean;
  protected abstract setGameCompareCardStrategy(game: Game): void;
}

export class CheckSingleCardPatternHandler extends CheckCardPatternHandler {
  public checkCardPattern(cards: Card[]) {
    return cards.length === 1 ? true : false;
  }

  protected setGameCompareCardStrategy(game: Game) {
    game.compareCardStrategy = new SinglCardPatternStrategy();
  }
}

export class CheckPairCardPatternHandler extends CheckCardPatternHandler {
  public checkCardPattern(cards: Card[]) {
    if (cards.length !== 2) return false;
    if (cards[0].rank !== cards[1].rank) return false;
    return true;
  }

  protected setGameCompareCardStrategy(game: Game) {
    game.compareCardStrategy = new PairCardPatternStrategy();
  }
}

export class CheckStraightCardPatternHandler extends CheckCardPatternHandler {
  public checkCardPattern(cards: Card[]) {
    if (cards.length !== 5) return false;

    const sort_cards = cards.sort((a, b) => {
      return Card.compareFirstCardBigThenNext(a, b) ? 1 : -1;
    });

    let previous_card_rank_size = sort_cards[0].rankSize;

    for (let i = 1; i < cards.length; i++) {
      const card_rank_size = sort_cards[i].rankSize;
      if (card_rank_size !== previous_card_rank_size + 1) return false;
      previous_card_rank_size = card_rank_size;
    }

    return true;
  }

  protected setGameCompareCardStrategy(game: Game) {
    game.compareCardStrategy = new StraightCardPatternStrategy();
  }
}

export class CheckFullHouseCardPatternHandler extends CheckCardPatternHandler {
  public checkCardPattern(cards: Card[]) {
    if (cards.length !== 5) return false;

    const same_rank_card_map: { [key: string]: Card[] } = {};
    cards.forEach((card) => {
      if (same_rank_card_map[card.rank]) {
        same_rank_card_map[card.rank].push(card);
      } else {
        same_rank_card_map[card.rank] = [card];
      }
    });

    const same_rank_cards = Object.values(same_rank_card_map);
    if (
      (same_rank_cards[0].length === 3 && same_rank_cards[1].length === 2) ||
      (same_rank_cards[0].length === 2 && same_rank_cards[1].length === 3)
    ) {
      return true;
    }

    return false;
  }

  protected setGameCompareCardStrategy(game: Game) {
    game.compareCardStrategy = new FullHousePatternStrategy();
  }
}
