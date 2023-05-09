import { Card } from "./card";
import {
  CheckCardPatternHandler,
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "./ckeck_card_pattern_handler";

export interface CardPatternStrategy {
  cardPatternName: string;
  checkCardPatternHandler: CheckCardPatternHandler;
  checkCardsBigThanTopPlay(cards: Card[], top_play: Card[]): boolean;
  checkCardPattern(cards: Card[]): boolean;
  AIPlayCard(hand_card: Card[], top_play: Card[]): Card[];
}

export abstract class CardPatternBasedStrategy implements CardPatternStrategy {
  public abstract cardPatternName: string;
  public abstract checkCardPatternHandler: CheckCardPatternHandler;
  public abstract AIPlayCard(hand_card: Card[], top_play: Card[]): Card[];

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

export class SinglCardPatternStrategy extends CardPatternBasedStrategy {
  public cardPatternName: string = "單張";
  public checkCardPatternHandler = new CheckSingleCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    return cards[0];
  }

  public AIPlayCard(hand_card: Card[], top_play: Card[]) {
    const big_top_play_card = this.findTheBigCard(top_play);
    const can_play_card = hand_card.find((card) =>
      Card.compareFirstCardBigThenNext(card, big_top_play_card)
    );

    return can_play_card ? [can_play_card] : [];
  }
}

export class PairCardPatternStrategy extends CardPatternBasedStrategy {
  public cardPatternName: string = "對子";
  public checkCardPatternHandler = new CheckPairCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    return Card.compareFirstCardBigThenNext(cards[0], cards[1])
      ? cards[0]
      : cards[1];
  }

  public AIPlayCard(hand_card: Card[], top_play: Card[]) {
    const big_top_play_card = this.findTheBigCard(top_play);
    const can_play_cards = hand_card.filter((card) =>
      Card.compareFirstCardBigThenNext(card, big_top_play_card)
    );
    const result: Card[] = [];
    if (can_play_cards.length < 2) return result;

    let previous_card_rank = can_play_cards[0].rank;
    for (let i = 1; i < can_play_cards.length; i++) {
      if (can_play_cards[i].rank === previous_card_rank) {
        result.push(can_play_cards[i - 1], can_play_cards[i]);
        break;
      }
      previous_card_rank = can_play_cards[i].rank;
    }

    return result;
  }
}

export class StraightCardPatternStrategy extends CardPatternBasedStrategy {
  public cardPatternName: string = "順子";
  public checkCardPatternHandler = new CheckStraightCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    const sort_cards = cards.sort((a, b) => {
      return Card.compareFirstCardBigThenNext(a, b) ? 1 : -1;
    });

    return sort_cards[4];
  }

  public AIPlayCard(hand_card: Card[], top_play: Card[]) {
    let result: Card[] = [];
    if (hand_card.length < 5) return result;

    const big_top_play_card = this.findTheBigCard(top_play);
    let previous_card_rank = hand_card[hand_card.length - 1].rankSize;
    result.push(hand_card[hand_card.length - 1]);

    for (let i = hand_card.length - 2; i >= 0; i--) {
      if (hand_card[i].rankSize + 1 === previous_card_rank) {
        result.push(hand_card[i]);
        if (result.length === 5) {
          return Card.compareFirstCardBigThenNext(result[0], big_top_play_card)
            ? result
            : [];
        }
      } else {
        result = [];
      }
      previous_card_rank = hand_card[i].rankSize;
    }
    return [];
  }
}

export class FullHousePatternStrategy extends CardPatternBasedStrategy {
  public cardPatternName: string = "葫蘆";
  public checkCardPatternHandler = new CheckFullHouseCardPatternHandler(null);

  protected findTheBigCard(cards: Card[]) {
    const same_rank_card_map = this.makeSameRankCardMap(cards);

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

  public AIPlayCard(hand_card: Card[], top_play: Card[]) {
    let result: Card[] = [];
    if (hand_card.length < 5) return result;

    let three_same_rank_cards: Card[] | undefined;
    let two_same_rank_cards: Card[] | undefined;
    const same_rank_card_map = this.makeSameRankCardMap(hand_card);
    const big_top_play_card = this.findTheBigCard(top_play);

    Object.values(same_rank_card_map).forEach((cards) => {
      const card_amount = cards.length;
      if (card_amount === 2 && !two_same_rank_cards) {
        two_same_rank_cards = cards;
      } else if (
        card_amount === 3 &&
        cards[0].rankSize > big_top_play_card.rankSize
      ) {
        three_same_rank_cards = cards;
      }
    });

    if (three_same_rank_cards && two_same_rank_cards) {
      result.push(...three_same_rank_cards, ...two_same_rank_cards);
    }

    return result;
  }

  private makeSameRankCardMap(cards: Card[]) {
    const same_rank_card_map: { [key: string]: Card[] } = {};

    cards.forEach((card) => {
      if (same_rank_card_map[card.rank]) {
        same_rank_card_map[card.rank].push(card);
      } else {
        same_rank_card_map[card.rank] = [card];
      }
    });

    return same_rank_card_map;
  }
}
