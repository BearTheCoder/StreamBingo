require('dotenv').config;
const express = require("express");
const app = express();
app.listen(process.env.PORT, () => console.log("listening...")); // Railway Deploy
app.use(express.static('public'));
app.use(express.json());

app.post('/startStreams', (postRequest, postResponse) => {

  let feederObject = {
    request: postRequest,
    response: postResponse,
    streamArray: [],
    categories: [],
    stopLoading: false,
    responseTime: 90000,
    pageNo: "",
  };

  const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.ClientID}&client_secret=${process.env.ClientSecret}&grant_type=client_credentials`;
  fetch(url, { method: "POST" })
    .then(res => res.json())
    .then(authorizationObject => {
      const upperCaseSubstring = authorizationObject.token_type.substring(0, 1).toUpperCase();
      const tokenSubstring = authorizationObject.token_type.substring(1, authorizationObject.token_type.length);
      const authorization = `${upperCaseSubstring + tokenSubstring} ${authorizationObject.access_token}`;
      const headers = { authorization, "Client-Id": process.env.ClientID, };

      if (feederObject.request.body.searchQuery !== "") {
        getCategories(feederObject, headers);
      }
      else {
        getStreams(feederObject, headers);
        responseTimout(feederObject, "success");
      }
    });
});

function getCategories(feederObject, headers) {
  feederObject.categories = [];
  let categoryEndpoint = `https://api.twitch.tv/helix/search/categories?query=${feederObject.request.searchQuery}`;
  fetch(categoryEndpoint, { headers })
    .then(res => res.json())
    .then(dataObject => {
      for (let category of dataObject.data) {
        feederObject.categories.push(category.name);
      }
      if (categories.length !== 0) {
        getStreams(feederObject, headers);
        responseTimout(feederObject, "success");
      }
      else {
        feederObject.stopLoading = true;
        feederObject.responseTime = 1000;
        responseTimout(feederObject, "failure");
      }
    });
}

function getStreams(feederObject, headers) {
  if (feederObject.pageNo !== undefined && !feederObject.stopLoading) {
    let streamsEndpoint = "";
    if (feederObject.pageNo === "") streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100`;
    else streamsEndpoint = `https://api.twitch.tv/helix/streams?language=en&first=100&after=${feederObject.pageNo}`;
    fetch(streamsEndpoint, { headers })
      .then(res => res.json())
      .then(dataObject => {
        for (let user of dataObject.data) {
          if (feederObject.categories.length !== 0) {
            if (user.viewer_count <= feederObject.maxViewers && feederObject.categories.includes(user.game_name)) {
              feederObject.streamArray.push(user);
            }
          }
          else if (user.viewer_count <= feederObject.maxViewers) {
            feederObject.streamArray.push(user);
          }
        }
        feederObject.pageNo = dataObject.pagination.cursor;
        getStreams(feederObject, headers);
      });
  }
}

function responseTimout(feederObject, status) {
  setTimeout(() => {
    feederObject.stopLoading = true;
    if (status === "success") console.log(`Loading Finalized. Total Streams: ${feederObject.streamArray.length}`);
    else if (status === "failure") console.log(`Load ended in failure, sent alert to client...`);
    feederObject.response.json({
      status: status,
      streams: feederObject.streamArray
    });
  }, feederObject.responseTime);
}