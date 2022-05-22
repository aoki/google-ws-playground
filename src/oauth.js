const { google } = require("googleapis");
const sheets = google.sheets("v4");
const http = require("http");
require("dotenv").config();
require("isomorphic-fetch");

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
console.log(`Redirect URL: ${process.env.REDIRECT_URL}`);

const authorizeUrl = oauth2Client.generateAuthUrl({
  scope: "https://www.googleapis.com/auth/spreadsheets",
  access_type: "offline",
});

// https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps?hl=ja
const querystring = require("node:querystring");
const open = require("open");
const url = require("node:url");
const server = http
  .createServer(async (req, res) => {
    if (req.url.indexOf("/callback") > -1) {
      const qs = querystring.parse(url.parse(req.url).query);
      console.log(`Code: ${qs.code}`);

      res.end("Authentication successful! Please return to the console.");
      server.close();

      const r = await oauth2Client.getToken(qs.code);
      oauth2Client.setCredentials(r.tokens);

      console.info("Tokens acquired.");

      const spreadsheetId = process.env.PUBLIC_SHEETS_ID;
      const range = "A1:E10";

      const apiOptions = {
        auth: oauth2Client,
        spreadsheetId,
        range,
      };

      const sheet = await sheets.spreadsheets.values.get(apiOptions);
      console.log(sheet.data.values);
    }
  })
  .listen(80, () => {
    console.log(`Authorize URL: ${authorizeUrl}`);
    open(authorizeUrl);
  });
