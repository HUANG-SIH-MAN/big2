import { expect } from "chai";
import { Game } from "../src/game";
import { AIPlayer, HumanPlayer } from "../src/player";
import { Card, Deck } from "../src/card";
import commandLine from "../src/command_line";
import { SinglCardPatternStrategy } from "../src/compare_card_strategy";
import sinon, { SinonMock } from "sinon";
const sandbox = sinon.createSandbox();

describe("test game", () => {
  let mock: SinonMock;

  beforeEach(() => {
    mock = sandbox.mock(commandLine);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("basic", () => {
    const game = new Game();

    // @ts-ignore
    expect(game.deck.cardList.length).to.be.equal(52);
    expect(game.topPlay).to.be.empty;
    // @ts-ignore
    expect(game.topPlayer).to.be.null;
  });

  it("add player", () => {
    const game = new Game();
    const ai_player = new AIPlayer(game);
    const human_player = new HumanPlayer();
    game.addPlayer([ai_player, human_player]);

    // @ts-ignore
    expect(game.playerList.length).to.be.equal(2);
    // @ts-ignore
    expect(game.playerList[0]).to.be.equal(ai_player);
    // @ts-ignore
    expect(game.playerList[1]).to.be.equal(human_player);
  });

  it("add to much player", () => {
    const game = new Game();

    expect(() =>
      game.addPlayer([
        new HumanPlayer(),
        new HumanPlayer(),
        new HumanPlayer(),
        new HumanPlayer(),
        new HumanPlayer(),
      ])
    ).to.throw(Error, "Big 2 game can't have more than 4 player");
  });

  it("game start with 4 player", async () => {
    const game = new Game();
    game.addPlayer([new AIPlayer(game)]);

    const error = await game.start().catch((err) => err);
    expect(error).to.be.an("Error");
    expect(error.message).to.equal("play Big 2 game at least have 2 player");
  });

  it("game start with 4 player", async () => {
    const game = new Game();
    game.addPlayer([
      new AIPlayer(game),
      new AIPlayer(game),
      new AIPlayer(game),
      new AIPlayer(game),
    ]);

    const error = await game.start().catch((err) => err);
    expect(error).to.not.be.exist;
  });

  it("game start prepare", async () => {
    const game = new Game();
    game.addPlayer([
      new AIPlayer(game),
      new AIPlayer(game),
      new AIPlayer(game),
      new AIPlayer(game),
    ]);

    const deck_spy = sandbox.spy(Deck.prototype, "shuffle");
    const player_name_self = sandbox.spy(AIPlayer.prototype, "nameSelf");
    const player_sort_hand_card = sandbox.spy(
      AIPlayer.prototype,
      "sortHandCard"
    );

    // @ts-ignore
    await game.gameStartPrepare();

    expect(deck_spy.withArgs().calledOnce).to.be.true;
    expect(player_name_self.withArgs().callCount).to.be.equal(4);
    expect(player_sort_hand_card.withArgs().callCount).to.be.equal(4);

    // @ts-ignore
    game.playerList.forEach((player) => {
      expect(player.hand.cardList.length).to.be.equal(13);
    });
  });

  it("find first player", () => {
    const game = new Game();
    const normal_player = new AIPlayer(game);
    normal_player.addHandCard(new Card("C", "6"));

    const target_player = new AIPlayer(game);
    target_player.addHandCard(new Card("C", "3"));

    game.addPlayer([normal_player, target_player]);

    // @ts-ignore
    const result = game.findFirstPlayer();
    expect(result).to.be.equal(target_player);
  });

  it("top player turn: frist round", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    const card = new Card("C", "3");
    player.addHandCard(card);
    // @ts-ignore
    game.topPlayer = player;

    mock.expects("playingCards").withArgs().once().resolves("0");
    // @ts-ignore
    await game.topPlayerTurn();

    mock.verify();
    expect(game.topPlay).to.be.eql([card]);
    expect(game.compareCardStrategy instanceof SinglCardPatternStrategy).to.be
      .true;
    // @ts-ignore
    expect(game.finishFristRound).to.be.true;
    expect(player.hand.cardList).to.be.empty;
  });

  it("top player turn: frist round and didn't show club 3", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    const club_3 = new Card("C", "3");
    player.addHandCard(club_3);
    player.addHandCard(new Card("C", "4"));
    // @ts-ignore
    game.topPlayer = player;

    let calltime = 0;
    sandbox.stub(commandLine, "playingCards").callsFake(async () => {
      calltime++;
      return calltime === 1 ? "1" : "0";
    });

    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.topPlayerTurn();

    mock.verify();

    expect(spy.withArgs("此牌型不合法，請再嘗試一次。").calledOnce).to.be.true;
  });

  it("top player turn: pass", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    player.addHandCard(new Card("C", "4"));
    // @ts-ignore
    game.topPlayer = player;
    // @ts-ignore
    game.finishFristRound = true;

    let calltime = 0;
    sandbox.stub(commandLine, "playingCards").callsFake(async () => {
      calltime++;
      return calltime === 1 ? "-1" : "0";
    });

    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.topPlayerTurn();

    mock.verify();

    expect(spy.withArgs("你不能在新的回合中喊 PASS").calledOnce).to.be.true;
  });

  it("top player turn: wrong card pattern", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    player.addHandCard(new Card("C", "4"));
    player.addHandCard(new Card("C", "5"));
    // @ts-ignore
    game.topPlayer = player;
    // @ts-ignore
    game.finishFristRound = true;

    let calltime = 0;
    sandbox.stub(commandLine, "playingCards").callsFake(async () => {
      calltime++;
      return calltime === 1 ? "0 1" : "0";
    });
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.topPlayerTurn();
    mock.verify();
    expect(spy.withArgs("此牌型不合法，請再嘗試一次。").calledOnce).to.be.true;
  });

  it("check game is end", () => {
    const game = new Game();
    const player = new HumanPlayer();
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    const result = game.checkGameEnd(player);
    expect(result).to.be.true;
    // @ts-ignore
    expect(game.gameEnd).to.be.true;
    expect(spy.withArgs("遊戲結束，遊戲的勝利者為 fake name").calledOnce).to.be
      .true;
  });

  it("check game is not end", () => {
    const game = new Game();
    const player = new HumanPlayer();
    player.addHandCard(new Card("D", "3"));
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    const result = game.checkGameEnd(player);
    expect(result).to.be.false;
    // @ts-ignore
    expect(game.gameEnd).to.be.false;
    expect(spy.notCalled).to.be.true;
  });

  it("normal player turn: pass", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    const top_player = new AIPlayer(game);
    // @ts-ignore
    game.topPlayer = top_player;
    mock.expects("playingCards").withArgs().once().resolves("-1");
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.normalPlayerTurn(player);
    mock.verify();

    // @ts-ignore
    expect(game.topPlayer).to.be.equal(top_player);
    expect(spy.withArgs("玩家 fake name PASS").calledOnce).to.be.true;
  });

  it("normal player turn: wrong card pattern", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    player.addHandCard(new Card("D", "5"));
    player.addHandCard(new Card("H", "5"));
    const top_player = new AIPlayer(game);
    // @ts-ignore
    game.topPlayer = top_player;
    game.topPlay = [new Card("D", "3")];
    game.compareCardStrategy = new SinglCardPatternStrategy();

    let calltime = 0;
    sandbox.stub(commandLine, "playingCards").callsFake(async () => {
      calltime++;
      return calltime === 1 ? "0 1" : "0";
    });
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.normalPlayerTurn(player);
    expect(spy.withArgs("此牌型不合法，請再嘗試一次。").calledOnce).to.be.true;
  });

  it("normal player turn: small than top play", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    player.addHandCard(new Card("D", "5"));
    player.addHandCard(new Card("H", "10"));
    const top_player = new AIPlayer(game);
    // @ts-ignore
    game.topPlayer = top_player;
    game.topPlay = [new Card("D", "9")];
    game.compareCardStrategy = new SinglCardPatternStrategy();

    let calltime = 0;
    sandbox.stub(commandLine, "playingCards").callsFake(async () => {
      calltime++;
      return calltime === 1 ? "0" : "1";
    });
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.normalPlayerTurn(player);
    expect(spy.withArgs("此牌型不合法，請再嘗試一次。").calledOnce).to.be.true;
  });

  it("normal player turn: big than top play", async () => {
    const game = new Game();
    const player = new HumanPlayer();
    const card = new Card("H", "10");
    player.addHandCard(card);
    const top_player = new AIPlayer(game);
    // @ts-ignore
    game.topPlayer = top_player;
    game.topPlay = [new Card("D", "9")];
    game.compareCardStrategy = new SinglCardPatternStrategy();
    mock.expects("playingCards").withArgs().once().resolves("0");
    const spy = sandbox.spy(console, "log");

    // @ts-ignore
    await game.normalPlayerTurn(player);

    mock.verify();
    expect(game.topPlay).to.be.eql([card]);
    // @ts-ignore
    expect(game.topPlayer).to.be.equal(player);
    expect(spy.withArgs("玩家 fake name 打出了 單張 H[10] ").calledOnce).to.be
      .true;
  });
});
