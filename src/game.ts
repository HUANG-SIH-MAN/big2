import { Card, Deck } from "./card";
import { Player } from "./player";
import { CardCompareStrategy } from "./compare_card_strategy";
import {
  CheckCardPatternHandler,
  CheckSingleCardPatternHandler,
} from "./ckeck_card_pattern_handler";

export class Game {
  private deck: Deck;
  private _topPlay: Card[] = [];
  private topPlayer: Player | null = null;
  private playerList: Player[] = [];
  private _compareCardStrategy: CardCompareStrategy | null = null;
  private checkCardPatternHandler: CheckCardPatternHandler;
  private finishFristRound: boolean = false;
  private gameEnd: boolean = false;

  constructor(
    handler: CheckCardPatternHandler = new CheckSingleCardPatternHandler(null)
  ) {
    this.deck = new Deck();
    this.checkCardPatternHandler = handler;
  }

  public addPlayer(players: Player[]) {
    if (this.playerList.length + players.length > 4) {
      throw Error("Big 2 game can't have more than 4 player");
    }

    this.playerList.push(...players);
    return;
  }

  public async start() {
    await this.gameStartPrepare();

    while (!this.gameEnd) {
      await this.takeTurn();
    }
    return;
  }

  private async gameStartPrepare() {
    this.deck.shuffle();

    for (const player of this.playerList) {
      await player.nameSelf();
    }

    while (this.deck.cardList.length >= this.playerList.length) {
      this.playerList.forEach((player) => {
        player.addHandCard(this.deck.deal());
      });
    }

    this.playerList.forEach((player) => player.sortHandCard());

    return;
  }

  private async takeTurn() {
    console.log("新的回合開始了。");

    if (!this.topPlayer) {
      this.topPlayer = this.findFirstPlayer() as Player;
    }

    this.topPlayer.hand.showHandCard();
    await this.topPlayerTurn();
    if (this.checkGameEnd(this.topPlayer)) return;

    let nextPlayerIndex = this.playerList.indexOf(this.topPlayer) + 1;

    while (this.playerList[nextPlayerIndex % 4] !== this.topPlayer) {
      const now_player = this.playerList[nextPlayerIndex % 4];
      now_player.hand.showHandCard();
      await this.normalPlayerTurn(now_player);
      if (this.checkGameEnd(now_player)) return;
      nextPlayerIndex++;
    }

    this._topPlay = [];
    return;
  }

  private findFirstPlayer() {
    for (let i = 0; i < this.playerList.length; i++) {
      const result = this.playerList[i].hand.cardList.some(
        (card) => card.suit === "C" && card.rank === "3"
      );

      if (result) return this.playerList[i];
    }
  }

  private async topPlayerTurn(): Promise<void> {
    const play_cards = await this.topPlayer!.play();

    if (play_cards.length === 0) {
      console.log("你不能在新的回合中喊 PASS");
      return await this.topPlayerTurn();
    }

    if (!this.finishFristRound) {
      const have_club_3 = play_cards.some(
        (card) => card.rank === "3" && card.suit === "C"
      );
      if (!have_club_3) {
        console.log("此牌型不合法，請再嘗試一次。");
        return await this.topPlayerTurn();
      }
      this.finishFristRound = true;
    }

    this.checkCardPatternHandler.checkTopPlayCardPatternAndSetGameCompareStrategy(
      play_cards,
      this
    );

    if (this._topPlay.length === 0) {
      console.log("此牌型不合法，請再嘗試一次。");
      return await this.topPlayerTurn();
    }

    this.topPlayer!.playCard(
      play_cards,
      this._compareCardStrategy!.cardPatternName
    );

    return;
  }

  private checkGameEnd(nowPlayer: Player) {
    if (nowPlayer.hand.cardList.length === 0) {
      console.log(`遊戲結束，遊戲的勝利者為 ${nowPlayer.name}`);
      this.gameEnd = true;
    }
    return this.gameEnd;
  }

  private async normalPlayerTurn(nowPlayer: Player): Promise<void> {
    const play_cards = await nowPlayer.play();
    if (play_cards.length === 0) {
      console.log(`玩家 ${nowPlayer.name} PASS`);
      return;
    }

    if (!this._compareCardStrategy!.checkCardPattern(play_cards)) {
      console.log("此牌型不合法，請再嘗試一次。");
      return await this.normalPlayerTurn(nowPlayer);
    }

    if (
      !this._compareCardStrategy!.checkCardsBigThanTopPlay(
        play_cards,
        this._topPlay
      )
    ) {
      console.log("此牌型不合法，請再嘗試一次。");
      return await this.normalPlayerTurn(nowPlayer);
    }

    this._topPlay = play_cards;
    this.topPlayer = nowPlayer;
    nowPlayer.playCard(play_cards, this._compareCardStrategy!.cardPatternName);

    return;
  }

  set compareCardStrategy(compareCardStrategy: CardCompareStrategy) {
    this._compareCardStrategy = compareCardStrategy;
  }

  set topPlay(topPlay: Card[]) {
    this._topPlay = topPlay;
  }

  get topPlay() {
    return this._topPlay;
  }

  get compareCardStrategy() {
    return this._compareCardStrategy!;
  }
}
