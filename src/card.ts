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
    const first_rank_index = Card.rank_enum.indexOf(first.rank);
    const second_rank_index = Card.rank_enum.indexOf(second.rank);

    if (first_rank_index > second_rank_index) return true;
    if (first_rank_index < second_rank_index) return false;

    const first_suit_index = Card.suit_enum.indexOf(first.suit);
    const second_suit_index = Card.suit_enum.indexOf(second.suit);

    if (first_suit_index > second_suit_index) return true;
    if (first_suit_index < second_suit_index) return false;

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
}
