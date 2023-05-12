const nextStreamButton = document.getElementById('nextStreamButton');
const resetStreamsButton = document.getElementById('resetStreamsButton');
const startCardButton = document.getElementById('startCardButton');
const randomizeCardButton = document.getElementById('randomizeCardButton');
const resetCardButton = document.getElementById('resetCardButton');
const defaultScreen = document.getElementById('twitch-embed').innerHTML;

nextStreamButton.disabled = true;
resetStreamsButton.disabled = true;
resetCardButton.disabled = true;

let streamArray = [];

function loadStreams() {
  streamArray = [];
  const searchQuery = getSearchQuery();
  fetchStreams(searchQuery);
  controlLoadingUI();
};

function getSearchQuery() {
  const maxViewers = document.getElementById("MaxViewCount").value === "" ? 10000000 : parseInt(document.getElementById('MaxViewCount').value); // Handles no input
  maxViewers >= 1 ? maxViewers : 1; // Handles negative input
  const searchQuery = document.getElementById("CategoryInput").value;
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      maxViewers: maxViewers,
      searchQuery: searchQuery,
    }),
  };
}

function fetchStreams(searchQuery) {
  fetch('/startStreams', searchQuery) //post
    .then(promise => promise.json())
    .then(jsonResponse => {
      if (jsonResponse.status === "success") {
        const gameName = jsonResponse.streams[0].game_name;
        const viewerCount = jsonResponse.streams[0].viewer_count;
        const userName = jsonResponse.streams[0].user_name;
        const loadedInfoNode = document.getElementById("LoadedUser");
        loadedInfoNode.innerHTML = `${userName} is streaming ${gameName} to ${viewerCount} viewers.`;
        document.getElementById("twitch-embed").innerHTML = '';
        new Twitch.Player(document.getElementById("twitch-embed"), { channel: userName });
        loadChat(userName);
        document.getElementById('PageHeader').innerHTML = `Streams Loaded: ${jsonResponse.streams.length}`;
        streamArray = jsonResponse.streams;
        nextStreamButton.disabled = false;
      }
      else if (jsonResponse.status === "failure") {
        alert("Search query returned no results, please try a different term.");
        resetStreamHTML();
      }
    });
}

function controlLoadingUI() {
  resetStreamsButton.disabled = false;
  let timeToLoad = 90;
  const timer = document.getElementById("twitch-embed");
  timer.innerHTML = `<img src="loading-gif.gif" width="100"/><h4 id="tempTimer">Loading Streams 90 seconds left...</h4>`;
  let tempTimer = document.getElementById('tempTimer');
  setInterval(() => {
    tempTimer.innerText = `Loading Streams ${timeToLoad--} seconds left...`;
  }, 1000);
}

function loadNextStream() {
  let RandNum = Math.floor(Math.random() * streamArray.length);
  document.getElementById("LoadedUser").innerHTML =
    `${streamArray[RandNum].user_name} is streaming ${streamArray[RandNum].game_name} 
    to ${streamArray[RandNum].viewer_count} viewers.`;
  document.getElementById("twitch-embed").innerHTML = '';
  new Twitch.Player(document.getElementById("twitch-embed"), { channel: streamArray[RandNum].user_login });
  loadChat(streamArray[RandNum].user_login)
}

function loadChat(channel) {
  const chatEmbed = document.getElementById("chat_embed");
  chatEmbed.src = `https://www.twitch.tv/embed/{channel}/chat?parent=streambingo.live/`
}

function resetStreamHTML() {
  document.getElementById("twitch-embed").innerHTML = defaultScreen;
  document.getElementById("LoadedUser").innerHTML = 'Load streams to get stream information.';
  document.getElementById("PageHeader").innerHTML = `Streams Loaded: 0`;
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
