import { google } from 'googleapis';

type SettingsType = 'social' | 'llm';

// Initialize the Google Sheets API
const sheets = google.sheets('v4');

// This will be set after initialization
let authClient: any = null;

/**
 * Initialize the Google Sheets API with service account credentials
 */
export async function initGoogleSheets(credentials: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    authClient = await auth.getClient();
    google.options({ auth: authClient });
    return true;
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return false;
  }
}

/**
 * Get settings from Google Sheet
 */
export async function getSettings(spreadsheetId: string, type: SettingsType): Promise<Record<string, string>> {
  if (!authClient) {
    throw new Error('Google Sheets not initialized. Call initGoogleSheets first.');
  }

  try {
    const range = `${type}Settings!A2:B`; // Assuming first row is header
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    const settings: Record<string, string> = {};

    rows.forEach((row) => {
      if (row.length >= 2) {
        settings[row[0]] = row[1];
      }
    });

    return settings;
  } catch (error) {
    console.error('Error getting settings from Google Sheets:', error);
    throw error;
  }
}

/**
 * Save settings to Google Sheet
 */
export async function saveSettings(
  spreadsheetId: string,
  type: SettingsType,
  key: string,
  value: string
): Promise<boolean> {
  if (!authClient) {
    throw new Error('Google Sheets not initialized. Call initGoogleSheets first.');
  }

  try {
    // First, get all settings to check if the key exists
    const settings = await getSettings(spreadsheetId, type);
    const rowIndex = Object.keys(settings).indexOf(key) + 2; // +2 because of 1-based index and header row

    if (rowIndex > 1) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${type}Settings!A${rowIndex}:B${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[key, value]],
        },
      });
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${type}Settings!A:B`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[key, value]],
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error saving settings to Google Sheets:', error);
    return false;
  }
}

/**
 * Initialize the Google Sheet with required sheets if they don't exist
 */
export async function initializeSpreadsheet(spreadsheetId: string): Promise<boolean> {
  if (!authClient) {
    throw new Error('Google Sheets not initialized. Call initGoogleSheets first.');
  }

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties.title',
    });

    const sheetsExist = response.data.sheets || [];
    const sheetTitles = sheetsExist.map(sheet => sheet.properties?.title);
    const requests = [];

    // Create socialSettings sheet if it doesn't exist
    if (!sheetTitles.includes('socialSettings')) {
      requests.push({
        addSheet: {
          properties: {
            title: 'socialSettings',
          },
        },
      });
    }

    // Create llmSettings sheet if it doesn't exist
    if (!sheetTitles.includes('llmSettings')) {
      requests.push({
        addSheet: {
          properties: {
            title: 'llmSettings',
          },
        },
      });
    }

    // Add headers to sheets if they were just created
    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests,
        },
      });

      // Add headers to new sheets
      await Promise.all([
        sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'socialSettings!A1:B1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Key', 'Value']],
          },
        }),
        sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'llmSettings!A1:B1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Key', 'Value']],
          },
        }),
      ]);
    }

    return true;
  } catch (error) {
    console.error('Error initializing spreadsheet:', error);
    return false;
  }
}
