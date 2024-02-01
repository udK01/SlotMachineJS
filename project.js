// 1. Deposit Money.                            O
// 2. Determine Number Of Lines To Bet.         O
// 3. Collect Bet Amount.                       O
// 4. Spin The Slot Machine.                    O
// 5. Check If User Won.                        O
// 6. Give User Winnings Or Take Bet On Loss.   O
// 7. Handle Replay Or Out Of Funds.            O

const prompt = require(`prompt-sync`)();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  const depositAmount = prompt(`Enter a deposit amount: `);
  return validateInput(deposit, Number(depositAmount));
};

const getNumberOfLines = () => {
  const lines = prompt(`Enter the amount of lines to bet on: `);
  return validateInput(
    getNumberOfLines,
    Number(lines),
    false,
    (x) => x <= ROWS
  );
};

const getBet = (balance, numberOfLines) => {
  const bet = prompt(`Enter a bet: `);
  return validateInput(
    getBet,
    Number(bet),
    true,
    (x) => x <= balance / numberOfLines
  );
};

function validateInput(callback, x, args = false, condition = null) {
  if (isNaN(x) || x <= 0 || (condition && !condition(x))) {
    console.log(`Invalid Input! Try Again.`);
    return args ? callback(balance, numberOfLines) : callback();
  } else {
    return x;
  }
}

const spin = () => {
  const symbols = [];

  // Adding Symbols.
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  // Picking Symbols.
  const reels = [[], [], []];
  for (let i = 0; i < COLS; i++) {
    const rowSpecificSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * rowSpecificSymbols.length);
      const selectedSymbol = rowSpecificSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      rowSpecificSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      i != rows.length - 1
        ? (rowString += symbol + ` | `)
        : (rowString += symbol);
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, numberOfLines) => {
  let winnings = 0;

  for (let row = 0; row < numberOfLines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

let balance = deposit();

while (true) {
  console.log(`You have a balance of £${balance}.`);
  const numberOfLines = getNumberOfLines();
  const bet = getBet(balance, numberOfLines);
  balance -= bet * numberOfLines;
  const reels = spin();
  const rows = transpose(reels);
  printRows(rows);
  const winnings = getWinnings(rows, bet, numberOfLines);
  balance += winnings;
  console.log(`You won, £${winnings}`);

  if (balance <= 0) {
    console.log(`You ran out of money. :c`);
    break;
  }

  const playAgain = prompt(`Play again? (y/n) `);
  if (playAgain != `y`) break;
}
