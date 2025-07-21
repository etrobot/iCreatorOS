
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
const GOOGLE_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ? 
  JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) : null;

const sheets = google.sheets({
  version: 'v4',
  auth: new google.auth.GoogleAuth({
    credentials: GOOGLE_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  }),
});

export async function getSettings() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Settings!A:C',
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(1).reduce((acc, row) => {
      acc[row[0]] = { value: row[1], category: row[2] };
      return acc;
    }, {} as Record<string, { value: string, category: string }>);
  }
  return {};
}

export async function updateSetting(id: string, value: string, category: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Settings!A:A',
  });
  const rows = response.data.values;
  let rowIndex = rows ? rows.findIndex(row => row[0] === id) : -1;

  if (rowIndex === -1) {
    rowIndex = rows ? rows.length : 0;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Settings!A${rowIndex + 1}:C${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[id, value, category]],
    },
  });
}
