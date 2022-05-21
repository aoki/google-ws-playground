require("isomorphic-fetch");
const { google } = require("googleapis");
require("dotenv").config();

const http = require("http");
const url = require("url");
const server = http.createServer((req, res) => {
  res.end("token in the url");
  server.close();
});
server.listen(80);

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const authorizeUrl = oauth2Client.generateAuthUrl({
  scope: "https://www.googleapis.com/auth/spreadsheets",
  response_type: "token",
});

console.log(authorizeUrl);
