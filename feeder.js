require('dotenv').config;
const express = require("express");
const app = express();
app.listen(process.env.PORT, () => console.log("listening...")); // Railway Deploy
app.use(express.static('public'));
app.use(express.json());
let categories = [];
let stopLoading = false;
let responseTime = 90000;

app.post('/startStreams', (request, response) => {
  let streamArray = [];
  const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.ClientID}&client_secret=${process.env.ClientSecret}&grant_type=client_credentials`;
  fetch(url, { method: "POST" })
    .then(res => res.json())
    .then(authorizationObject => {
      const upperCaseSubstring = authorizationObject.token_type.substring(0, 1).toUpperCase();
      const tokenSubstring = authorizationObject.token_type.substring(1, authorizationObject.token_type.length);
      const authorization = `${upperCaseSubstring + tokenSubstring} ${authorizationObject.access_token}`;
      const headers = { authorization, "Client-Id": process.env.ClientID, }; //Railway

      if (request.body.searchQuery !== "") getCategories(request.body.searchQuery, headers);
      else {
        getStreams(headers, streamArray, "", request.body.maxViewers);
        responseTimout(response);
      }
    });
});

function getCategories(searchQuery, headers) {
  categories = [];
  let categoryEndpoint = `https://api.twitch.tv/helix/search/categories?query=${searchQuery}`;
  fetch(categoryEndpoint, { headers })
    .then(res => res.json())
    .then(DataObject => {
      for (let Node of DataObject.data) {
        categories.push(Node.name);
      }
      if (categories.length !== 0) getStreams(headers, streamArray, "", request.body.maxViewers);
      else stopLoading = true;
    });
}

function getStreams(headers, streamArray, pageNo, maxViewers) {
  if (pageNo !== undefined && !stopLoading) {
    let streamsEndpoint = "";
    if (pageNo === "") streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100`;
    else streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100&after=${pageNo}`;
    fetch(streamsEndpoint, { headers })
      .then(res => res.json())
      .then(dataObject => {
        for (let user of dataObject.data) {
          if (categories.length !== 0) {
            if (user.viewer_count <= maxViewers && categories.includes(user.game_name)) {
              streamArray.push(user);
            }
          }
          else if (user.viewer_count <= maxViewers) {
            streamArray.push(user);
          }
        }
        getStreams(headers, streamArray, dataObject.pagination.cursor, maxViewers);
      });
  }
}

function responseTimout(response) {
  setTimeout(() => {
    stopLoading = true;
    console.log(`Loading Finalized. Total Streams: ${streamArray.length}`);
    response.json({
      streams: streamArray
    });
  }, responseTime);
}