const { google } = require("googleapis");
const open = require("open");
const http = require("http");
const fs = require("fs");
require("dotenv").config();
const querystring = require("node:querystring");
const url = require("node:url");

const runCallbackServer = async (oauth2Client, tokenPath) => {
  // https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps?hl=ja
  const server = http.createServer(async (req, res) => {
    if (req.url.indexOf("/callback") > -1) {
      const qs = querystring.parse(url.parse(req.url).query);
      console.log(`Code: ${qs.code}`);

      res.end("Authentication successful! Please return to the console.");
      const r = await oauth2Client.getToken(qs.code);
      oauth2Client.setCredentials(r.tokens);
      await fs.promises.writeFile(tokenPath, JSON.stringify(r.tokens));

      console.info("Tokens acquired.");

      server.close();
    }
  });
  return server;
};

(async () => {
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
    response_type: "code",
    prompt: "consent",
  });

  console.log(`Authorize URL: ${authorizeUrl}`);
  open(authorizeUrl);

  const server = await runCallbackServer(oauth2Client, process.env.TOKEN_FILE);
  server.listen(80);
})();
