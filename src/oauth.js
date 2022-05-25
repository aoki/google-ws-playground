const { google } = require("googleapis");
const sheets = google.sheets("v4");
const http = require("http");
const fs = require("fs");
const open = require("open");
const querystring = require("node:querystring");
const url = require("node:url");
require("dotenv").config();
require("isomorphic-fetch");

const getNewToken = async (oauth2Client, tokenPath) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    scope: "https://www.googleapis.com/auth/spreadsheets",
    access_type: "offline",
  });

  console.log(`Authorize URL: ${authorizeUrl}`);
  open(authorizeUrl);

  await runCallbackServer(oauth2Client, tokenPath);
};

const getToken = async (oatuh2Client, tokenPath) => {
  const token = await fs.promises.readFile(tokenPath).catch(async () => {
    await getNewToken(oatuh2Client, tokenPath);
  });
};

const runCallbackServer = async (oauth2Client, tokenPath) => {
  // https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps?hl=ja
  const server = http
    .createServer(async (req, res) => {
      if (req.url.indexOf("/callback") > -1) {
        const qs = querystring.parse(url.parse(req.url).query);
        console.log(`Code: ${qs.code}`);

        res.end("Authentication successful! Please return to the console.");
        const r = await oauth2Client.getToken(qs.code);
        oauth2Client.setCredentials(r.tokens);
        await fs.promises.writeFile(tokenPath, JSON.stringify(r.tokens));

        console.info("Tokens acquired.");
      }
    })
    .listen(80, () => {});
};

(async () => {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  console.log(`Redirect URL: ${process.env.REDIRECT_URL}`);

  await getToken(oauth2Client, process.env.TOKEN_FILE);
  console.log("fooo");
  await loadSheets(oauth2Client);
})();

const loadSheets = async (oauth2Client) => {
  const spreadsheetId = process.env.PUBLIC_SHEETS_ID;
  const range = "A1:E10";

  const apiOptions = {
    auth: oauth2Client,
    spreadsheetId,
    range,
  };

  const sheet = await sheets.spreadsheets.values.get(apiOptions);
  console.log(sheet.data.values);
};
