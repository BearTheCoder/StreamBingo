const express = require("express");
require('dotenv').config;
const app = express();
app.listen(process.env.$PORT, () => console.log("listening..."));
app.use(express.static('public'));