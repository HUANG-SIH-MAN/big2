import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function enterUserName() {
  return new Promise<string>((resolve) => {
    rl.question("please enter player's name: ", (name) => {
      resolve(name);
    });
  });
}

async function playingCards() {
  return new Promise<string>((resolve) => {
    rl.question("", (choice) => {
      resolve(choice);
    });
  });
}

export default {
  enterUserName,
  playingCards,
};
