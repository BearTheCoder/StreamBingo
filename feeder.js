const express = require("express");
const app = express();
app.listen('0.0.0.0:$bingofeeder-production.up.railway.app', () => console.log("listening..."));
app.use(express.static('public'));