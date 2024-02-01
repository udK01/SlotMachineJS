// 1. Deposit Money.
// 2. Determine Number Of Lines To Bet.
// 3. Collect Bet Amount.
// 4. Spin The Slot Machine.
// 5. Check If User Won.
// 6. Give User Winnings Or Take Bet On Loss.
// 7. Handle Replay Or Out Of Funds.

const prompt = require(`prompt-sync`)();

const deposit = () => {
  const depositAmount = prompt(`Enter a deposit amount: `);
  return validateInput(deposit, Number(depositAmount));
};

const getNumberOfLines = () => {
  const lines = prompt(`Enter the amount of lines to bet on: `);
  return validateInput(getNumberOfLines, Number(lines), false, (x) => x <= 3);
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

let balance = deposit();
const numberOfLines = getNumberOfLines();
const bet = getBet(balance, numberOfLines);
