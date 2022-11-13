// *****     Railway env variables     *****
require('dotenv').config;

// *****     Express     *****
const express = require("express");
const app = express();
app.listen(process.env.PORT, () => console.log("listening..."));
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (request, response) => {
  console.log(request.body);
  response.end();
});

