require('dotenv').config;
const express = require("express");
const app = express();
app.listen(process.env.PORT, () => console.log("listening...")); // Railway Deploy
app.use(express.static('public'));
app.use(express.json());
let categories = [];
let stopLoading = false;

app.post('/startStreams', (request, response) => {
  let streamArray = [];
  const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.ClientID}&client_secret=${process.env.ClientSecret}&grant_type=client_credentials`;
  fetch(url, { method: "POST" })
    .then((res) => res.json())
    .then((authorizationObject) => {
      const NewTokenType = authorizationObject.token_type.substring(0, 1).toUpperCase() + authorizationObject.token_type.substring(1, authorizationObject.token_type.length);
      const authorization = `${NewTokenType} ${authorizationObject.access_token}`;
      const headers = { authorization, "Client-Id": process.env.ClientID, }; //Railway

      if (request.body.searchQuery !== "") categories = getCategories(request.body.searchQuery, headers);

      getStreams(headers, streamArray, "");
      setTimeout(() => {
        stopLoading = true;
        console.log(`Total Streams: ${streamArray}`);
        response.json({
          streams: streamArray
        });
      }, 90000);
    });
});

function getCategories(searchQuery, headers) {
  categories = [];
  let categoryEndpoint = `https://api.twitch.tv/helix/search/categories?query=${searchQuery}`;
  fetch(categoryEndpoint, { headers })
    .then((res) => res.json())
    .then((DataObject) => {
      for (let Node of DataObject.data) {
        categories.push(Node.name);
      }
      return categories;
    });
}

function getStreams(headers, streamArray, pageNo) {
  if (pageNo !== undefined) {
    let streamsEndpoint = "";
    if (pageNo === "") streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100`;
    else streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100&after=${pageNo}`;
    fetch(streamsEndpoint, { headers })
      .then((res) => res.json())
      .then((dataObject) => {
        for (let user of dataObject.data) {
          if (categories.length > 0) {
            if ((user.viewer_count <= request.body.maxViewers) && categories.includes(user.game_name)) {
              streamArray.push(user);
            }
          }
          else {
            streamArray.push(user);
          }
        }
        getStreams(headers, streamArray, dataObject.pagination.cursor);
      });
  }
}