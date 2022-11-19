const nextStreamButton = document.getElementById('nextStreamButton');
const resetStreamsButton = document.getElementById('resetStreamsButton');
nextStreamButton.disabled = true;
resetStreamsButton.disabled = true;

const defaultScreen = document.getElementById('twitch-embed').innerHTML;

let streamArray = [];
let twitchPlayer = null;

function loadStreams() {
  let maxViewers = document.getElementById("MaxViewCount").value === "" ? 1000000 : parseInt(document.getElementById('MaxViewCount').value);
  const searchQuery = document.getElementById("CategoryInput").value;
  maxViewers = maxViewers >= 1 ? maxViewers : 1;
  switchHTMLToLoading();
  streamArray = [];
  data = {
    searchQuery: searchQuery
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };

  fetch('/streams', options) //post
    .then(promise => promise.json())
    .then(jsonResponse => {
      filterStreams(jsonResponse, maxViewers, searchQuery);
    });
};

async function filterStreams(jsonResponse, maxViewers, searchQuery) {
  for (let user of jsonResponse.streams) {
    if (user.viewer_count <= maxViewers) {
      if (searchQuery === "") {
        streamArray.push(user);
      }
      else if (jsonResponse.categories.includes(user.game_name)) {
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

function switchHTMLToLoading() {
  let timer = 1;
  const counter = document.getElementById("twitch-embed");
  counter.innerHTML = `<img src="loading-gif.gif" width="100"/><h4 id="timer">Loading Streams. I took 0 seconds from you.</h4>`;
  const recursiveScript = setInterval(() => {
    if (document.getElementById('timer') !== null) {
      document.getElementById('timer').innerText = `Loading Streams. I took ${timer++} seconds from you.`;
    }
    else {
      clearInterval(recursiveScript);
    }
  }, 1000);
}

function loadFirstStream() {
  let RandNum = Math.floor(Math.random() * streamArray.length);
  const gameName = streamArray[RandNum].game_name;
  const viewerCount = streamArray[RandNum].viewer_count;
  const userName = streamArray[RandNum].user_name;
  const loadedInfoNode = document.getElementById("LoadedUser");
  loadedInfoNode.innerHTML = `${userName} is streaming ${gameName} to ${viewerCount} viewers.`;
  document.getElementById('PageHeader').innerHTML = `Streams Loaded: ${streamArray.length}`;
  document.getElementById("twitch-embed").innerHTML = '';
  twitchPlayer = new Twitch.Player(document.getElementById("twitch-embed"), { channel: userName });
  if (twitchPlayer.getEnded()) {
    loadNextStream();
  }
  nextStreamButton.disabled = false;
  resetStreamsButton.disabled = false;
}

function loadNextStream() {
  let RandNum = Math.floor(Math.random() * streamArray.length);
  document.getElementById("LoadedUser").innerHTML =
    `${streamArray[RandNum].user_name} is streaming ${streamArray[RandNum].game_name} 
    to ${streamArray[RandNum].viewer_count} viewers.`;
  document.getElementById("twitch-embed").innerHTML = '';
  twitchPlayer = new Twitch.Player(document.getElementById("twitch-embed"), { channel: streamArray[RandNum].user_name });
  console.log(`Stream Ended? ${twitchPlayer.getEnded()} ${typeof (twitchPlayer.getEnded())}`);
  if (twitchPlayer.getEnded()) {
    loadNextStream();
  }
}

function resetStreamHTML() {
  document.getElementById("twitch-embed").innerHTML = defaultScreen;
  document.getElementById("LoadedUser").innerHTML = 'Load streams to get stream information.';
  document.getElementById("PageHeader").innerHTML = `Streams Loaded: 0`;
  nextStreamButton.disabled = true;
  resetStreamsButton.disabled = true;
}