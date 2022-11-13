const express = require("express");
require('dotenv').config;
const app = express();
app.listen(`0.0.0.0:${process.env.$PORT}`, () => console.log("listening..."));
app.use(express.static('public'));