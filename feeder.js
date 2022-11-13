const express = require("express");
const app = express();
app.listen('$PORT', () => console.log("listening..."));
app.use(express.static('public'));