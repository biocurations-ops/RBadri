import { Inquiry } from '../types';

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
}

/**
 * Searches the user's Google Drive for a spreadsheet named 'badrileads'.
 */
export async function findSpreadsheetByName(accessToken: string, name: string): Promise<SpreadsheetInfo | null> {
  const query = encodeURIComponent(`name = '${name}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('findSpreadsheetByName HTTP error:', errText);
      let errorMsg = `Failed to search Google Drive: ${res.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errorMsg = parsed.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return {
        id: data.files[0].id,
        name: data.files[0].name,
        url: data.files[0].webViewLink || `https://docs.google.com/spreadsheets/d/${data.files[0].id}`,
      };
    }
    return null;
  } catch (error) {
    console.error('Error finding spreadsheet:', error);
    throw error;
  }
}

/**
 * Creates a new Google Sheet named 'badrileads' and writes the column headers.
 */
export async function createSpreadsheet(accessToken: string, name: string): Promise<SpreadsheetInfo> {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  
  try {
    // 1. Create spreadsheet
    const createRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: name,
        },
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error('createSpreadsheet HTTP error:', errText);
      let errorMsg = `Failed to create spreadsheet: ${createRes.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errorMsg = parsed.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const spreadsheet = await createRes.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const spreadsheetUrl = spreadsheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    const sheetTitle = spreadsheet.sheets?.[0]?.properties?.title || 'Sheet1';

    // 2. Initialize headers
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:I1?valueInputOption=RAW`;
    const headers = [
      'Lead ID',
      'Customer Name',
      'Email Address',
      'Phone Number',
      'Product Interest',
      'Message / Requirements',
      'Submission Date',
      'Lead Status',
      'Internal Notes'
    ];

    const headerRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A1:I1`,
        majorDimension: 'ROWS',
        values: [headers],
      }),
    });

    if (!headerRes.ok) {
      const errText = await headerRes.text();
      console.error('createSpreadsheet headers HTTP error:', errText);
      // We still return the sheet ID since the sheet was successfully created
    }

    return {
      id: spreadsheetId,
      name: name,
      url: spreadsheetUrl,
    };
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    throw error;
  }
}

/**
 * Fetches existing lead IDs from Column A of the spreadsheet.
 */
export async function fetchExistingLeadIds(accessToken: string, spreadsheetId: string): Promise<string[]> {
  // First we need to get sheet metadata to get the sheet title (or default to Sheet1)
  let sheetTitle = 'Sheet1';
  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      sheetTitle = meta.sheets?.[0]?.properties?.title || 'Sheet1';
    }
  } catch (e) {
    console.error('Error fetching sheet title, falling back to Sheet1:', e);
  }

  const range = `${sheetTitle}!A2:A`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 404) {
      // Range might be empty, return empty array
      return [];
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error('fetchExistingLeadIds HTTP error:', errText);
      let errorMsg = `Failed to fetch cell values: ${res.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errorMsg = parsed.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    if (data.values && Array.isArray(data.values)) {
      return data.values.map((row: any) => row[0]).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error fetching existing lead IDs:', error);
    return [];
  }
}

/**
 * Appends new leads to the Google Sheet.
 */
export async function appendLeadsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  leads: Inquiry[]
): Promise<boolean> {
  if (leads.length === 0) return true;

  let sheetTitle = 'Sheet1';
  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      sheetTitle = meta.sheets?.[0]?.properties?.title || 'Sheet1';
    }
  } catch (e) {
    console.error('Error fetching sheet title for append, falling back to Sheet1:', e);
  }

  const appendRange = `${sheetTitle}!A:I`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED`;

  const values = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone,
    lead.productInterest || 'General Enquiry',
    lead.message || 'Custom materials inquiry',
    lead.date,
    lead.status,
    lead.internalNotes || ''
  ]);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('appendLeadsToSpreadsheet HTTP error:', errText);
      throw new Error(`Failed to append lead values: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error appending leads:', error);
    throw error;
  }
}

/**
 * Completely clears the sheet contents (except headers) and writes all leads.
 */
export async function overwriteAllLeadsInSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  leads: Inquiry[]
): Promise<boolean> {
  let sheetTitle = 'Sheet1';
  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      sheetTitle = meta.sheets?.[0]?.properties?.title || 'Sheet1';
    }
  } catch (e) {
    console.error('Error fetching sheet title, falling back to Sheet1:', e);
  }

  // Clear sheet range from A2 to I1000
  const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A2:I10000:clear`;

  try {
    const clearRes = await fetch(clearUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!clearRes.ok) {
      const errText = await clearRes.text();
      console.error('overwriteAllLeadsInSpreadsheet clear HTTP error:', errText);
      throw new Error(`Failed to clear sheet before overwrite: ${clearRes.statusText}`);
    }

    if (leads.length === 0) return true;

    // Append all leads
    return await appendLeadsToSpreadsheet(accessToken, spreadsheetId, leads);
  } catch (error) {
    console.error('Error overwriting spreadsheet content:', error);
    throw error;
  }
}
