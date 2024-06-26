import { Card } from "./card";
import { Game } from "./game";
import commandLine from "./command_line";

export abstract class Player {
  protected _name: string = "fake name";
  private _hand: Hand;

  constructor() {
    this._hand = new Hand();
  }

  public abstract nameSelf(): Promise<void>;
  public abstract play(): Promise<Card[]>;

  public addHandCard(card: Card) {
    this.hand.addCard(card);
    return;
  }
  public sortHandCard() {
    this.hand.sortCard();
    return;
  }

  public playCard(cards: Card[], cardPatternName: string) {
    let card_word = "";
    cards.forEach((card) => (card_word += `${card.suit}[${card.rank}] `));

    console.log(`玩家 ${this._name} 打出了 ${cardPatternName} ${card_word}`);
    this.hand.removeCards(cards);
  }

  get name() {
    return this._name;
  }

  get hand() {
    return this._hand;
  }
}

export class AIPlayer extends Player {
  private game: Game;

  constructor(game: Game) {
    super();
    this.game = game;
  }

  public async nameSelf() {
    this._name = `AI ${Math.floor(Math.random() * 1000)}`;
    console.log(this._name);
    return;
  }

  public async play() {
    if (this.game.topPlay.length === 0) {
      return [this.hand.cardList[0]];
    }

    return this.game.compareCardStrategy.AIPlayCard(
      this.hand.cardList,
      this.game.topPlay
    );
  }
}

export class HumanPlayer extends Player {
  public async nameSelf() {
    this._name = await commandLine.enterUserName();
    console.log(this._name);
    return;
  }

  public async play(): Promise<Card[]> {
    const choice = await commandLine.playingCards();
    if (choice === "-1") return [];

    const result = [];
    const card_index = choice.split(" ").map((i) => Number(i));
    for (const index of card_index) {
      const card = this.hand.cardList[index];
      if (!card) {
        console.log("此牌型不合法，請再嘗試一次。");
        return await this.play();
      }
      result.push(card);
    }

    return result;
  }
}

export class Hand {
  private _cardList: Card[] = [];

  public addCard(card: Card) {
    this._cardList.push(card);
    return;
  }

  public sortCard() {
    this._cardList.sort((a, b) => {
      return Card.compareFirstCardBigThenNext(a, b) ? 1 : -1;
    });
  }

  public showHandCard() {
    let index_word = "";
    let card_word = "";

    this._cardList.forEach((card, index) => {
      const word = `${card.suit}[${card.rank}] `;
      const str_index = String(index);
      index_word += str_index + " ".padEnd(word.length - str_index.length);
      card_word += word;
    });

    console.log(index_word);
    console.log(card_word);

    return;
  }

  public removeCards(removeCards: Card[]) {
    this._cardList = this._cardList.filter(
      (card) => !removeCards.includes(card)
    );
  }

  get cardList() {
    return this._cardList;
  }
}
