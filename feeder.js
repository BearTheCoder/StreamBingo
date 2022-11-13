const express = require("express");
const app = express();
app.listen('0.0.0.0:$PORT', () => console.log("listening..."));
app.use(express.static('public'));