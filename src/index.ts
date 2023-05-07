import { Game } from "./game";
import {
  CheckSingleCardPatternHandler,
  CheckPairCardPatternHandler,
  CheckStraightCardPatternHandler,
  CheckFullHouseCardPatternHandler,
} from "./ckeck_card_pattern_handler";

import { HumanPlayer } from "./player";

const game = new Game(
  new CheckSingleCardPatternHandler(
    new CheckPairCardPatternHandler(
      new CheckStraightCardPatternHandler(
        new CheckFullHouseCardPatternHandler(null)
      )
    )
  )
);

game.addPlayer([
  new HumanPlayer(),
  new HumanPlayer(),
  new HumanPlayer(),
  new HumanPlayer(),
]);

game.start();
