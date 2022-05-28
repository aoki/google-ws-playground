const { google } = require("googleapis");
const sheets = google.sheets("v4");
const fs = require("fs");
require("dotenv").config();
const OAuth2 = google.auth.OAuth2;

(async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  const token = await fs.promises.readFile(process.env.TOKEN_FILE);

  oauth2Client.setCredentials(JSON.parse(token));
  oauth2Client.refreshAccessToken((err, tokens) => {
    if (err) {
      console.error(`refresh token error`);
      return;
    }
    console.log(`Refresh token: ${tokens}`);
    oauth2Client.setCredentials(JSON.parse(tokens));
  });

  const spreadsheetId = process.env.PUBLIC_SHEETS_ID;
  const range = "A1:E10";

  const apiOptions = {
    auth: oauth2Client,
    spreadsheetId,
    range,
  };

  const sheet = await sheets.spreadsheets.values.get(apiOptions);
  console.log(sheet.data.values);
})();
