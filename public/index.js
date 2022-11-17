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

function loadStreams () {
  streamArray = [];
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  };
  fetch('/streams', options) //post
    .then(promise => promise.json())
    .then(jsonResponse => {
      console.log(jsonResponse.streams);
      filterStreams(jsonResponse.streams);
    });
  let timeToLoad = 0;
  const timer = document.getElementById("twitch-embed");
  timer.innerHTML = `<img src="loading-gif.gif" width="100"/><h4 id="tempTimer">Loading Streams 90 seconds left...</h4>`;
  let tempTimer = document.getElementById('tempTimer');
  setInterval(() => {
    tempTimer.innerText = `Loading Streams ${ timeToLoad++ } seconds left...`;
  }, 1000);
};

function filterStreams (streams) {
  const maxViewers = document.getElementById("MaxViewCount").value === "" ? 1000000 : parseInt(document.getElementById('MaxViewCount').value);
  const searchQuery = document.getElementById("CategoryInput").value;
  maxViewers >= 1 ? maxViewers : 1;

  for (let user of streams) {
    if (user.viewer_count <= maxViewers) {
      if (searchQuery === "") {
        streamArray.push(user);
      }
      else if (user.game_name.includes(searchQuery)) {
        streamArray.push(user);
      }
    }
  }

  if (streamArray.length === 0) {
    alert("Search query returned no results. Try a different search query.");
    resetStreamHTML();
  }
  else { loadFirstStream(); }
}

function loadFirstStream () {
  let RandNum = Math.floor(Math.random() * streamArray.length);
  const gameName = jsonResponse.streams[ RandNum ].game_name;
  const viewerCount = jsonResponse.streams[ RandNum ].viewer_count;
  const userName = jsonResponse.streams[ RandNum ].user_name;
  const loadedInfoNode = document.getElementById("LoadedUser");
  loadedInfoNode.innerHTML = `${ userName } is streaming ${ gameName } to ${ viewerCount } viewers.`;
  document.getElementById("twitch-embed").innerHTML = '';
  new Twitch.Player(document.getElementById("twitch-embed"), { channel: userName });
  document.getElementById('PageHeader').innerHTML = `Streams Loaded: ${ jsonResponse.streams.length }`;
  nextStreamButton.disabled = false;
  resetStreamsButton.disabled = false;
}

function loadNextStream () {
  let RandNum = Math.floor(Math.random() * streamArray.length);
  document.getElementById("LoadedUser").innerHTML =
    `${ streamArray[ RandNum ].user_name } is streaming ${ streamArray[ RandNum ].game_name } 
    to ${ streamArray[ RandNum ].viewer_count } viewers.`;
  document.getElementById("twitch-embed").innerHTML = '';
  new Twitch.Player(document.getElementById("twitch-embed"), { channel: streamArray[ RandNum ].user_login });
}

function resetStreamHTML () {
  document.getElementById("twitch-embed").innerHTML = defaultScreen;
  document.getElementById("LoadedUser").innerHTML = 'Load streams to get stream information.';
  document.getElementById("PageHeader").innerHTML = `Streams Loaded: 0`;
}

function generateRandomBingoCard () {
  let bingoSquares = document.querySelectorAll("textarea");
  let duplicateArray = [];
  BingoCardDefaultOptions.forEach((option) => {
    duplicateArray.push(option);
  });
  bingoSquares.forEach((node) => {
    let randomNumber = Math.floor(Math.random() * duplicateArray.length);
    node.value = duplicateArray[ randomNumber ];
    duplicateArray.splice(randomNumber, 1);
  });
}

function startBingoCard () {
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
      node.outerHTML = `<p>${ node.value }</p>`;
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

function resetBingoCard () {
  const pArray = document.querySelectorAll("p");
  for (let node of pArray) {
    node.outerHTML = '<textarea placeholder="Enter A Square" cols="13" rows="4" maxlength="55"></textarea>';
  }
  resetCardButton.disabled = true;
  randomizeCardButton.disabled = false;
  startCardButton.disabled = false;
}
