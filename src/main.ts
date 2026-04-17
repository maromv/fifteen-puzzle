import * as readline from 'node:readline';
import {
  FifteenPuzzleCli,
  FifteenPuzzleGame,
  FifteenPuzzleTerminalRenderer,
} from './fifteen-puzzle';

const emoji = process.argv.includes('--emoji');

const cli = new FifteenPuzzleCli(
  FifteenPuzzleGame.new(),
  new FifteenPuzzleTerminalRenderer({ emoji }),
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  historySize: 0,
});

function render(): void {
  console.clear();
  console.log(cli.render());
  console.log(
    `\n${cli.isGameOver ?? 'Use arrow keys to move tiles. '}Press q to quit.`,
  );
  rl.question('\n> ', (input) => {
    cli.processCommand(input);
    render();
  });
  if (cli.isGameOver) {
    gameOver();
  }
}

function gameOver() {
  let counter = 0;
  const interval = setInterval(() => {
    console.clear();
    console.log(cli.render());
    if (counter > 10) {
      interval.close();
      rl.close();
    }
    counter++;
  }, 1000);
}
readline.emitKeypressEvents(process.stdin, rl);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

process.stdin.on('keypress', (_, key) => {
  if (!key) {
    return;
  }

  if (key.sequence === 'q' || (key.ctrl && key.name === 'c')) {
    console.log('\nGoodbye!');
    rl.close();
    return;
  }

  if (
    key.name === 'up' ||
    key.name === 'down' ||
    key.name === 'left' ||
    key.name === 'right'
  ) {
    cli.processArrow(key.name);
    readline.clearLine(process.stdout, 0);
    render();
  }
});

rl.on('close', () => {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
  process.stdin.pause();
});

render();
