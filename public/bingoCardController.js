const startCardButton = document.getElementById('startCardButton');
const randomizeCardButton = document.getElementById('randomizeCardButton');
const resetCardButton = document.getElementById('resetCardButton');

resetCardButton.disabled = true;

function startBingoCard() {
  const bingoSquares = document.querySelectorAll("textarea");
  const canStart = true;
  for (let node of bingoSquares) {
    if (node.value === "") {
      canStart = false;
      break;
    }
  }
  if (canStart) {
    for (let node of bingoSquares) {
      node.outerHTML = `<p>${node.value}</p>`;
    }
    const pArray = document.querySelectorAll("p");
    pArray.forEach((node) => {
      node.addEventListener("click", () => {
        node.classList.add('active');
      });
    });
    resetCardButton.disabled = false;
    randomizeCardButton.disabled = true;
    startCardButton.disabled = true;
  }
  else {
    alert("Please fill all bingo squares to play!");
  }
}

function resetBingoCard() {
  const pArray = document.querySelectorAll("p");
  for (let node of pArray) {
    node.outerHTML = '<textarea placeholder="Enter A Square" cols="13" rows="4" maxlength="55"></textarea>';
  }
  resetCardButton.disabled = true;
  randomizeCardButton.disabled = false;
  startCardButton.disabled = false;
}

function generateRandomBingoCard() {
  let bingoSquares = document.querySelectorAll("textarea");
  let duplicateArray = [];
  BingoCardDefaultOptions.forEach((option) => {
    duplicateArray.push(option);
  });
  bingoSquares.forEach((node) => {
    let randomNumber = Math.floor(Math.random() * duplicateArray.length);
    node.value = duplicateArray[randomNumber];
    duplicateArray.splice(randomNumber, 1);
  });
}