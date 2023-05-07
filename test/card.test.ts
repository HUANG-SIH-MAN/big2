import { Card, Deck } from "../src/card";
import { expect } from "chai";
import sinon from "sinon";
const sandbox = sinon.createSandbox();

describe("test card", () => {
  it("basic", () => {
    const card = new Card(Card.suit_enum[0], Card.rank_enum[0]);
    expect(card.suit).to.be.equal(Card.suit_enum[0]);
    expect(card.rank).to.be.equal(Card.rank_enum[0]);
  });

  it("test compare first card big then next, different rank", () => {
    const first_card = new Card("D", "6");
    const second_card = new Card("H", "10");

    const result = Card.compareFirstCardBigThenNext(first_card, second_card);
    expect(result).to.be.false;
  });

  it("test compare first card big then next, same rank", () => {
    const first_card = new Card("H", "6");
    const second_card = new Card("D", "6");

    const result = Card.compareFirstCardBigThenNext(first_card, second_card);
    expect(result).to.be.true;
  });
});

describe("test deck", () => {
  afterEach(() => {
    sandbox.restore();
  });

  it("basic", () => {
    const deck = new Deck();

    expect(deck.cardList.length).to.be.equal(52);
    expect(deck.cardList[0] instanceof Card).to.be.true;
  });

  it("deal", () => {
    const deck = new Deck();
    const card = deck.deal();

    expect(card.suit).to.be.equal("S");
    expect(card.rank).to.be.equal("2");
  });

  it("shuffle", () => {
    const spy = sandbox.spy(console, "log");
    const deck = new Deck();
    deck.shuffle();

    const cardListRank: string[] = [];
    deck.cardList.forEach((card) => cardListRank.push(card.rank));
    expect(cardListRank).to.not.be.eql([
      ...Card.rank_enum,
      ...Card.rank_enum,
      ...Card.rank_enum,
      ...Card.rank_enum,
    ]);
    expect(spy.calledOnce).to.be.true;
  });
});
