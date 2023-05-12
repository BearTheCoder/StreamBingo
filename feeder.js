/*
  Originally the idea was to load the streams on the server every 30 minutes and keep a constant list of the live streams on the server and send the list to the client.
  BUT, with no users, seemed unreasonable.
  Instead, until I have a user base, there is a 90 second load time so the server can load streams.

*/

require('dotenv').config; //process.env.VARIABLE used for Railway deployment
const express = require("express");
const app = express();
app.listen(process.env.PORT, () => console.log("listening..."));
app.use(express.static('public'));
app.use(express.json());

app.post('/startStreams', (postRequest, postResponse) => {

  console.log(postRequest.body.loadTime);

  let feederObject = {
    request: postRequest,
    response: postResponse,
    streamArray: [],
    categories: [],
    stopLoading: false,
    responseTime: postRequest.body.loadTime,
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
  let categoryEndpoint = `https://api.twitch.tv/helix/search/categories?query=${feederObject.request.body.searchQuery}`;
  fetch(categoryEndpoint, { headers })
    .then(res => res.json())
    .then(dataObject => {
      for (let category of dataObject.data) {
        feederObject.categories.push(category.name);
      }
      if (feederObject.categories.length !== 0) {
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
            if (user.viewer_count <= feederObject.request.body.maxViewers && feederObject.categories.includes(user.game_name)) {
              feederObject.streamArray.push(user);
            }
          }
          else if (user.viewer_count <= feederObject.request.body.maxViewers) {
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