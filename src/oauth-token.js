require("isomorphic-fetch");
const { google } = require("googleapis");
require("dotenv").config();
const fs = require("fs");

const http = require("http");
const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    console.log("\nAccess token is ...");
    let data = "";
    req.on("data", function (chunk) {
      data += chunk;
      console.log(JSON.parse(data));
    });
    server.close();
  }

  fs.readFile("./src/index.html", "utf-8", function (error, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  });
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

console.log("Authorize URL is ...");
console.log(authorizeUrl);

// https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps?hl=ja
