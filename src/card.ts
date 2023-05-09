export class Deck {
  private _cardList: Card[] = [];

  constructor() {
    Card.suit_enum.forEach((suit) => {
      Card.rank_enum.forEach((rank) => {
        this._cardList.push(new Card(suit, rank));
      });
    });
  }

  public deal() {
    const card = this._cardList.pop();
    if (!card) {
      throw Error("no card in deck");
    }
    return card;
  }

  public shuffle() {
    this._cardList.sort(() => Math.random() - 0.5);

    let card_word = "";
    this._cardList.forEach((card) => {
      card_word += `${card.suit}[${card.rank}] `;
    });
    console.log(card_word);

    return;
  }

  get cardList() {
    return this._cardList;
  }
}

export class Card {
  static suit_enum = ["C", "D", "H", "S"];
  static rank_enum = [
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
    "2",
  ];

  static compareFirstCardBigThenNext(first: Card, second: Card): boolean {
    if (first.rankSize > second.rankSize) return true;
    if (first.rankSize < second.rankSize) return false;
    if (first.suitSize > second.suitSize) return true;
    if (first.suitSize < second.suitSize) return false;
    return false;
  }

  private _suit: string;
  private _rank: string;

  constructor(suit: string, rank: string) {
    this._suit = suit;
    this._rank = rank;
  }

  get suit() {
    return this._suit;
  }

  get rank() {
    return this._rank;
  }

  get rankSize() {
    return Card.rank_enum.indexOf(this._rank);
  }

  get suitSize() {
    return Card.suit_enum.indexOf(this._suit);
  }
}
