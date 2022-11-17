require('dotenv').config; //process.env.VARIABLE used for Railway deployment

const express = require("express");
const app = express();
app.listen(process.env.PORT, () => console.log("listening..."));
app.use(express.static('public'));
app.use(express.json());

let stopLoading = false;
let streamArray = [];
let newStreamArray = [];
let categories = [];

getAuthHeader(null);
setInterval(getAuthHeader(null), 500000); //Move Get Auth here 30-min timeout?

function getAuthHeader(searchQuery) {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.ClientID}&client_secret=${process.env.ClientSecret}&grant_type=client_credentials`;
  fetch(url, { method: "POST" })
    .then(res => res.json())
    .then(authorizationObject => {
      const upperCaseSubstring = authorizationObject.token_type.substring(0, 1).toUpperCase();
      const tokenSubstring = authorizationObject.token_type.substring(1, authorizationObject.token_type.length);
      const authorization = `${upperCaseSubstring + tokenSubstring} ${authorizationObject.access_token}`;
      const headers = { authorization, "Client-Id": process.env.ClientID, };
      if (searchQuery === null) getStreams(headers, null);
      else getCategories(searchQuery, headers);
    });
  if (searchQuery === null) {
    console.log("Timeout countdown started...");
    setTimeout(() => {
      stopLoading = true;
    }, 90000);
  }
}

function getStreams(headers, pageNo) {
  if (pageNo !== undefined && stopLoading === false) {
    let streamsEndpoint = "";
    if (pageNo === null) streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100`;
    else streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100&after=${pageNo}`;
    fetch(streamsEndpoint, { headers })
      .then(res => res.json())
      .then(dataObject => {
        for (let user of dataObject.data) {
          newStreamArray.push(user);
        }
        getStreams(headers, dataObject.pagination.cursor);
      });
  }
  else {
    streamArray = Array.from(newStreamArray);
    newStreamArray = [];
    const timeoutReason = pageNo === undefined ? 'pageNo undefined' : 'timeout';
    console.log(`Loading stoped. Reason: ${timeoutReason}`);
  }
}

function getCategories(searchQuery, headers) {
  console.log("Searching for categories...");
  categories = [];
  let categoryEndpoint = `https://api.twitch.tv/helix/search/categories?query=${searchQuery}`;
  fetch(categoryEndpoint, { headers })
    .then(res => res.json())
    .then(dataObject => {
      for (let category of dataObject.data) {
        categories.push(category.name);
      }
    });
}

app.post('/streams', (request, response) => {
  if (request.searchQuery !== "") {
    getAuthHeader(searchQuery);
  }
  response.json({
    streams: streamArray,
    categories: categories,
  });
});