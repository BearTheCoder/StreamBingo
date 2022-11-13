// *****     Environment Variables     *****
require('dotenv').config;

// *****     Global Variables     *****
let TwitchArray = [];
let Counter = 0;
let PageNo = "";
let MaxViewers = 10000000;
let Categories = [];
let FirstLoop = true;
let StopStreams = false;

// *****     Twitch Api Communication     *****
async function GetStreams(Local_PageNo) {
  let endpoint = ``;
  if (Local_PageNo === '') { endpoint = `https://api.twitch.tv/helix/streams?language=en&first=10`; } // First Page
  else { endpoint = `https://api.twitch.tv/helix/streams?language=en&first=100&after=${Local_PageNo}`; } // Next Page
  let authorizationObject = await GetTwithAuth();
  let NewTokenType = authorizationObject.token_type.substring(0, 1).toUpperCase() + authorizationObject.token_type.substring(1, authorizationObject.token_type.length);
  let authorization = `${NewTokenType} ${authorizationObject.access_token}`;
  let headers = { authorization, "Client-Id": process.env.ClientID, }; //Object?
  fetch(endpoint, { headers }).then((res) => res.json()).then((DataObject) => RenderStreams(DataObject)); // S..Still need to learn what this does...
}

async function GetCategory(SearchQuery) {
  endpoint = `https://api.twitch.tv/helix/search/categories?query=${SearchQuery}`;
  let authorizationObject = await GetTwithAuth();
  let NewTokenType = authorizationObject.token_type.substring(0, 1).toUpperCase() + authorizationObject.token_type.substring(1, authorizationObject.token_type.length);
  let authorization = `${NewTokenType} ${authorizationObject.access_token}`;
  let headers = { authorization, "Client-Id": process.env.ClientID, }; //Object?
  fetch(endpoint, { headers }).then((res) => res.json()).then((DataObject) => RenderCatagories(DataObject));
}

function GetTwithAuth() {
  let URL = `https://id.twitch.tv/oauth2/token?client_id=${process.env.ClientID}&client_secret=${process.env.ClientSecret}&grant_type=client_credentials`;
  let Data =  fetch(URL, { method: "POST" }).then((res) => res.json()).then((data) => { return data; });
  console.log(Data);
  return Data;
}

function GetTwitchPlayer(User) {
  document.getElementById("twitch-embed").innerHTML = '';
  new Twitch.Player(document.getElementById("twitch-embed"), { channel: User });
}

// *****     Twitch Data Processing     *****
function RenderStreams(DataObject) {
  let UserArray = DataObject.data;
  for (let User of UserArray) {
    if (User.viewer_count <= MaxViewers) {
      if (Categories.length === 0){
        TwitchArray.push(User); 
        document.getElementById("PageHeader").innerHTML = `Streams Loaded: ${TwitchArray.length}`; 
      }
      else {
        if (Categories.includes(User.game_name)){
          TwitchArray.push(User); 
          document.getElementById("PageHeader").innerHTML = `Streams Loaded: ${TwitchArray.length}`; 
        }
      }
      if (TwitchArray.length === 1 && FirstLoop === true){ 
        StartFirstStream();
        FirstLoop = false;
      }
      else if (TwitchArray.length > 1){ 
        EnableNextButton();
      }
    }
  }
  PageNo = DataObject.pagination.cursor
}

function RenderCatagories(DataObject){
  for (let Node of DataObject.data){
    Categories.push(Node.name);
  }
}

// *****     Stream Processing     *****
function StartFirstStream() {
  let RandNum = Math.floor(Math.random() * TwitchArray.length); //
  document.getElementById("LoadedUser").innerHTML = 
    `${TwitchArray[RandNum].user_name} is streaming ${TwitchArray[RandNum].game_name} 
    to ${TwitchArray[RandNum].viewer_count} viewers.`; 
  GetTwitchPlayer(TwitchArray[RandNum].user_login) //
}

function LoopStreams() {
  if (StopStreams === false && PageNo !== undefined){
    setTimeout(function () {
      GetStreams(PageNo);
      Counter++
      if (Counter < 400) {
        LoopStreams();
      }
      else {
        console.log("Max stream iterations reach.")
      }
    }, 1000);
  }
  else {
    console.log("End of streams reached.")
  }
}

function ResetStream() {
  document.getElementById("twitch-embed").innerHTML = 
  '<div id="TE_Row1">' +
      '<label for="MaxViewCount">Max Viewers: </label>' +
      '<input placeholder="Leave blank for no filtering..." type="number" name="MaxViewCount" id="MaxViewCount">'+
    '</div>' +
      '<div id="HorizontalGap"></div>' +
      '<div id="Te_Row2">' +
        '<label for="CategoryInput">Category: </label>' +
        '<input placeholder="Leave blank for no filtering..." type="text" name="CategoryInput" id="CategoryInput">' +
      '</div>' +
      '<div id="HorizontalGap"></div>' +
      '<div id="Te_Row3">' +
        '<label for="LanguageSelect">Language: </label>' +
        '<select name="LanguageSelect" id="LanguageSelect" disabled="true">' +
          '<option value="English">English</option>' +
          '<!-- Add more languages when you can -->' +
        '</select>' +
      '</div>' +
      '<div id="HorizontalGap"></div>' +
      '<button id="LoadStreamsButton" onclick="LoadStreamsButtonClick()">Load Streams</button>';
  TwitchArray = [];
  Counter = 0;
  PageNo = "";
  MaxViewers = 10000000;
  Categories = [];
  FirstLoop = true;
  document.getElementById("LoadedUser").innerHTML = 'Load streams to get stream information.';
  document.getElementById("PageHeader").innerHTML = `Streams Loaded: 0`; 
}

// *****     Bingo Card Related     *****
function CheckForEmptyBingoSquares(TA_Array){
  let CanStart = true;
  for (let TA of TA_Array){
    if (TA.value === "") {
      CanStart = false;
    }
  }
  return CanStart;
}

// *****     Button Click Functions     *****
function LoadStreamsButtonClick() {
  if (document.getElementById("MaxViewCount").value !== ""){
    MaxViewers = parseInt(document.getElementById("MaxViewCount").value);
  }
  if (document.getElementById("CategoryInput").value !== ""){
    GetCategory(document.getElementById("CategoryInput").value);
  }
  document.getElementById("twitch-embed").innerHTML = "<h1>Loading Streams...</h1>";
  StopStreams = false;
  EnableResetStreamsButton();
  LoopStreams();
}

function NextButtonClick() {
  let RandNum = Math.floor(Math.random() * TwitchArray.length); 
  document.getElementById("LoadedUser").innerHTML = 
    `${TwitchArray[RandNum].user_name} is streaming ${TwitchArray[RandNum].game_name} 
    to ${TwitchArray[RandNum].viewer_count} viewers.`; 
  GetTwitchPlayer(TwitchArray[RandNum].user_login); 
}

function ResetStreamsButtonClick() {
  StopStreams = true;
  DisableResetStreamsButton();
  document.getElementById("twitch-embed").innerHTML = "<h1>Resetting Streams...</h1>"
  setTimeout(ResetStream, 5000);
}

function StartBingoButtonClick(){
  let ElementArray = document.querySelectorAll("textarea");
  let CanStart = CheckForEmptyBingoSquares(ElementArray);
  if (CanStart) {
    for(let Node of ElementArray){
      Node.outerHTML = `<p>${Node.value}</p>`;
    }
    let PArray = document.querySelectorAll("p");
    PArray.forEach((Node) => {
      Node.addEventListener("click", () => {
        Node.classList.add('active');
      })
    })
    EnableResetBingoButton();
    DisableRandomizeButton();
    DisableStartBingoButton();
  }
  else {
    alert("Please fill all bingo squares to play!");
  }
}

function RandomBingoButtonClick() {
  let TA_Array = document.querySelectorAll("textarea");
  let DuplicateArray = [];
  for (let Element of BingoCardDefaultOptions){
    DuplicateArray.push(Element);
  }
  for (let Node of TA_Array){
    let RandNum = Math.floor(Math.random()* DuplicateArray.length)
    Node.value = DuplicateArray[RandNum];
    DuplicateArray.splice(RandNum, 1);
  }
}

function ResetBingoButtonClick(){
  let ElementArray = document.querySelectorAll("p");
  for(let Node of ElementArray){
    Node.outerHTML = '<textarea placeholder="Enter A Square" cols="13" rows="4" maxlength="55"></textarea>';
  }
  DisableResetBingoButton();
  EnableRandomizeButton();
  EnableStartBingoButton();
}

// *****     Button QOL     *****
function DisableNextButton() {
  document.getElementById("NextButton").disabled = true;
}

function EnableNextButton() {
  document.getElementById("NextButton").disabled = false;
}

function EnableStartBingoButton() {
  document.getElementById("StartBingoButton").disabled = false;
}

function DisableStartBingoButton() {
  document.getElementById("StartBingoButton").disabled = true;
}

function DisableResetBingoButton(){
  document.getElementById("ResetBingoCardButton").disabled = true;
}

function EnableResetBingoButton(){
  document.getElementById("ResetBingoCardButton").disabled = false;
}

function DisableResetStreamsButton(){
  document.getElementById("ResetStreamsButton").disabled = true;
}

function EnableResetStreamsButton(){
  document.getElementById("ResetStreamsButton").disabled = false;
}

function DisableRandomizeButton(){
  document.getElementById("RandomizeBingoCardButton").disabled = true;
}

function EnableRandomizeButton(){
  document.getElementById("RandomizeBingoCardButton").disabled = false;
}

// *****     QOL - Testing - Delete if published     *****
function FillAllSquaresForTesting() {
  let ElementArray = document.querySelectorAll("textarea");
  for(let Node of ElementArray){
    Node.value = "This is a test";
  }
}

// On Init - On Load
DisableNextButton();
DisableResetBingoButton();
DisableResetStreamsButton();
EnableStartBingoButton();
