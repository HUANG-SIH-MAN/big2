import { Player, Hand, AIPlayer, HumanPlayer } from "../src/player";
import { Card } from "../src/card";
import { Game } from "../src/game";
import { expect } from "chai";
import commandLine from "../src/command_line";
import { SinglCardPatternStrategy } from "../src/compare_card_strategy";
import sinon, { SinonMock } from "sinon";
const sandbox = sinon.createSandbox();

describe("test player", () => {
  afterEach(() => {
    sandbox.restore();
  });

  it("basic", () => {
    // @ts-ignore
    const player = new Player();

    expect(player.hand instanceof Hand).to.be.true;
    expect(player.hand.cardList).to.be.empty;
  });

  it("add hand card", () => {
    const card = new Card("H", "3");
    // @ts-ignore
    const player = new Player();

    player.addHandCard(card);

    expect(player.hand.cardList[0]).to.be.equal(card);
  });

  it("sort hand card", () => {
    const frist_card = new Card("H", "6");
    const second_card = new Card("H", "3");
    const thrid_card = new Card("C", "6");
    // @ts-ignore
    const player = new Player();
    player.addHandCard(frist_card);
    player.addHandCard(second_card);
    player.addHandCard(thrid_card);

    player.sortHandCard();

    expect(player.hand.cardList[0]).to.be.equal(second_card);
    expect(player.hand.cardList[1]).to.be.equal(thrid_card);
    expect(player.hand.cardList[2]).to.be.equal(frist_card);
  });

  it("remove hand card", () => {
    // @ts-ignore
    const player = new Player();
    // @ts-ignore
    const remove_card = new Card("D", "6");
    const exist_card = new Card("S", "5");
    player.addHandCard(remove_card);
    player.addHandCard(exist_card);
    const spy = sandbox.spy(console, "log");

    player.playCard([remove_card], "單張");

    expect(spy.withArgs("玩家 fake name 打出了 單張 D[6] ").calledOnce).to.be
      .true;
    expect(player.hand.cardList.length).to.be.equal(1);
    expect(player.hand.cardList[0]).to.be.equal(exist_card);
  });
});

describe("test AI player", () => {
  afterEach(() => {
    sandbox.restore();
  });

  it("name self", () => {
    const spy = sandbox.spy(console, "log");
    const game = new Game();
    const AI_player = new AIPlayer(game);
    AI_player.nameSelf();

    expect(AI_player.name.includes("AI")).to.be.true;
    expect(spy.withArgs(AI_player.name).calledOnce).to.be.true;
  });

  it("play: is top player", async () => {
    const game = new Game();
    const player = new AIPlayer(game);
    const card = new Card("D", "5");
    player.addHandCard(card);
    player.addHandCard(new Card("H", "K"));

    const result = await player.play();
    expect(result).to.be.eql([card]);
  });

  it("play: is not top player", async () => {
    const game = new Game();
    // @ts-ignore
    game.topPlayer = new HumanPlayer();
    game.topPlay = [new Card("C", "7")];
    game.compareCardStrategy = new SinglCardPatternStrategy();

    const player = new AIPlayer(game);
    const card = new Card("H", "K");
    player.addHandCard(new Card("D", "5"));
    player.addHandCard(card);

    const result = await player.play();
    expect(result).to.be.eql([card]);
  });
});

describe("test human player", () => {
  let mock: SinonMock;

  beforeEach(() => {
    mock = sandbox.mock(commandLine);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("name self", async () => {
    const spy = sandbox.spy(console, "log");
    mock.expects("enterUserName").withArgs().once().resolves("fake name");
    const human_player = new HumanPlayer();
    await human_player.nameSelf();

    expect(human_player.name).to.be.equal("fake name");
    expect(spy.withArgs("fake name").calledOnce).to.be.true;
    mock.verify();
  });

  it("play game: pass", async () => {
    mock.expects("playingCards").withArgs().once().resolves("-1");
    const human_player = new HumanPlayer();

    const result = await human_player.play();

    mock.verify();
    expect(result).to.be.empty;
  });

  it("play game: have the corresponding card", async () => {
    const human_player = new HumanPlayer();
    const frist_card = new Card("C", "3");
    const second_card = new Card("D", "9");
    const third_card = new Card("H", "3");
    human_player.addHandCard(frist_card);
    human_player.addHandCard(second_card);
    human_player.addHandCard(third_card);

    mock.expects("playingCards").withArgs().once().resolves("0 2");
    const result = await human_player.play();
    mock.verify();

    expect(result.length).to.be.equal(2);
    expect(result[0]).to.be.equal(frist_card);
    expect(result[1]).to.be.equal(third_card);
  });

  it("play game: user enter wrong answer", async () => {
    const human_player = new HumanPlayer();
    const card = new Card("C", "3");
    human_player.addHandCard(card);
    let calltime = 0;
    const spy = sandbox.spy(console, "log");
    sandbox.stub(commandLine, "playingCards").callsFake(async () => {
      calltime++;
      return calltime === 1 ? "0 3" : "0";
    });

    const result = await human_player.play();

    expect(spy.withArgs("此牌型不合法，請再嘗試一次。").calledOnce).to.be.true;
    expect(result.length).to.be.equal(1);
    expect(result[0]).to.be.equal(card);
  });
});

describe("test hand", () => {
  const hand = new Hand();

  afterEach(() => {
    sandbox.restore();
  });

  before(() => {
    hand.addCard(new Card("D", "4"));
    hand.addCard(new Card("S", "6"));
    hand.addCard(new Card("H", "10"));
  });

  it("show hand card", () => {
    const spy = sandbox.spy(console, "log");
    hand.showHandCard();

    expect(spy.withArgs("0    1    2    ").calledOnce).to.be.true;
    expect(spy.withArgs("D[4] S[6] H[10] ").calledOnce).to.be.true;
  });
});
