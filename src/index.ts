import { Game } from "./game";
import {
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "./ckeck_card_pattern_handler";

import { HumanPlayer, AIPlayer } from "./player";

const game = new Game(
  new CheckSingleCardPatternHandler(
    new CheckPairCardPatternHandler(
      new CheckStraightCardPatternHandler(
        new CheckFullHouseCardPatternHandler(null)
      )
    )
  )
);

// TODO: 可以玩2-4人的大老二遊戲，請自行決定玩家數量
game.addPlayer([
  // new AIPlayer(game),
  // new AIPlayer(game),
  new AIPlayer(game),
  new AIPlayer(game),
  new HumanPlayer(),
  // new HumanPlayer(),
  // new HumanPlayer(),
  // new HumanPlayer(),
]);

game.start();
