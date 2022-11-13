const express = require("express");
const app = express();
app.listen('$port', () => console.log("listening..."));
app.use(express.static('public'));