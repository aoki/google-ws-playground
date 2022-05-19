const { google } = require("googleapis");
const sheets = google.sheets("v4");
require("dotenv").config();

(async () => {
  const auth = await google.auth.getClient({
    keyFile: "./sa-secret.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const spreadsheetId = process.env.PUBLIC_SHEETS_ID;
  const range = "A1:E10";

  const apiOptions = {
    auth,
    spreadsheetId,
    range,
  };

  const res = await sheets.spreadsheets.values.get(apiOptions);
  console.log(res.data.values);
})();
