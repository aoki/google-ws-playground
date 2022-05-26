const { google } = require("googleapis");
const open = require("open");
const http = require("http");
const fs = require("fs");
require("dotenv").config();
const querystring = require("node:querystring");
const url = require("node:url");

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
const token = await fs.promises.readFile(tokenPath);

const spreadsheetId = process.env.PUBLIC_SHEETS_ID;
const range = "A1:E10";

const apiOptions = {
  auth: oauth2Client,
  spreadsheetId,
  range,
};

const sheet = await sheets.spreadsheets.values.get(apiOptions);
console.log(sheet.data.values);
