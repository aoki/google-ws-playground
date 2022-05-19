require("isomorphic-fetch");

require("dotenv").config();

// https://developers.google.com/sheets/api/reference/rest
(async () => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.PUBLIC_SHEETS_ID}/values/A1:E10?key=${process.env.GOOGLE_API_KEY}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    console.log(data);
  }
})();
