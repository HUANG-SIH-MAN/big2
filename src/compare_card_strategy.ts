import { Card } from "./card";
import {
  CheckCardPatternHandler,
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "./ckeck_card_pattern_handler";

export interface CardCompareStrategy {
  cardPatternName: string;
  checkCardPatternHandler: CheckCardPatternHandler;
  checkCardsBigThanTopPlay(cards: Card[], top_play: Card[]): boolean;
  checkCardPattern(cards: Card[]): boolean;
}

export abstract class CompareCardBasedStrategy implements CardCompareStrategy {
  public abstract cardPatternName: string;
  public abstract checkCardPatternHandler: CheckCardPatternHandler;

  public checkCardsBigThanTopPlay(cards: Card[], top_play: Card[]) {
    const big_card = this.findTheBigCard(cards);
    const big_top_play_card = this.findTheBigCard(top_play);

    return Card.compareFirstCardBigThenNext(big_card, big_top_play_card);
  }

  protected abstract findTheBigCard(cards: Card[]): Card;

  public checkCardPattern(cards: Card[]) {
    return this.checkCardPatternHandler.checkCardPattern(cards);
  }
}

export class SingleCompareCardStrategy extends CompareCardBasedStrategy {
  public cardPatternName: string = "單張";
  public checkCardPatternHandler = new CheckSingleCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    return cards[0];
  }
}

export class PairCompareCardStrategy extends CompareCardBasedStrategy {
  public cardPatternName: string = "對子";
  public checkCardPatternHandler = new CheckPairCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    return Card.compareFirstCardBigThenNext(cards[0], cards[1])
      ? cards[0]
      : cards[1];
  }
}

export class StraightCompareCardStrategy extends CompareCardBasedStrategy {
  public cardPatternName: string = "順子";
  public checkCardPatternHandler = new CheckStraightCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    const sort_cards = cards.sort((a, b) => {
      return Card.compareFirstCardBigThenNext(a, b) ? 1 : -1;
    });

    return sort_cards[4];
  }
}

export class FullHouseCompareCardStrategy extends CompareCardBasedStrategy {
  public cardPatternName: string = "葫蘆";
  public checkCardPatternHandler = new CheckFullHouseCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    const same_rank_card_map: { [key: string]: Card[] } = {};

    cards.forEach((card) => {
      if (same_rank_card_map[card.rank]) {
        same_rank_card_map[card.rank].push(card);
      } else {
        same_rank_card_map[card.rank] = [card];
      }
    });

    let result: Card | null = null;
    Object.values(same_rank_card_map).forEach((cards) => {
      if (cards.length === 3) {
        cards.sort((a, b) => {
          return Card.compareFirstCardBigThenNext(a, b) ? 1 : -1;
        });
        result = cards[2];
      }
    });

    return result!;
  }
}
