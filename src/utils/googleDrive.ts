export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  imageUrl: string;
  webViewLink?: string;
}

/**
 * Lists all files inside a public or shared Google Drive folder using the active OAuth access token.
 * Uses the standard Google Drive API v3.
 */
export async function fetchDriveFolderFiles(accessToken: string, folderId: string): Promise<DriveFile[]> {
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink)&pageSize=100`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('fetchDriveFolderFiles HTTP error:', errText);
      throw new Error(`Failed to read Google Drive folder: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.files || !Array.isArray(data.files)) {
      return [];
    }

    // Map files and use Google Drive's direct thumbnail query parameter with high resolution (sz=w1000)
    // which operates as a direct public image bypass for embedded images.
    return data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      imageUrl: `https://drive.google.com/thumbnail?sz=w1000&id=${file.id}`,
      webViewLink: file.webViewLink
    }));
  } catch (error) {
    console.error('Error in fetchDriveFolderFiles:', error);
    throw error;
  }
}
