const bingoDiv = document.getElementById("bingoDiv");
const chatDiv = document.getElementById("chatDiv");
const innerChatDiv = document.getElementById("innerChatDiv");
const innerBingoDiv = document.getElementById("innerBingoDiv");


bingoDiv.addEventListener("click", () => {
  bingoDiv.classList.add("focused");
  bingoDiv.classList.remove("collapsed");
  chatDiv.classList.add("collapsed");
  chatDiv.classList.remove("focused");
  innerChatDiv.classList.add("hidden");
  innerChatDiv.classList.remove("showing");
  innerBingoDiv.classList.add("showing");
  innerBingoDiv.classList.remove("hidden");
});

chatDiv.addEventListener("click", () => {
  bingoDiv.classList.add("collapsed");
  bingoDiv.classList.remove("focused");
  chatDiv.classList.add("focused");
  chatDiv.classList.remove("collapsed");
  innerChatDiv.classList.add("showing");
  innerChatDiv.classList.remove("hidden");
  innerBingoDiv.classList.add("hidden");
  innerBingoDiv.classList.remove("showing");
});