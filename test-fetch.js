async function test() {
  try {
    const res = await fetch('https://drive.google.com/drive/folders/1kAGkfn3Y2nSgLPLRh-2r_JuxEHkIQIv0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });
    const text = await res.text();
    console.log('Page size:', text.length);

    const keywords = ['plywood', 'door', 'board', 'mdf', 'hmr'];
    for (const kw of keywords) {
      const idx = text.toLowerCase().indexOf(kw);
      if (idx !== -1) {
        console.log(`Keyword "${kw}" found at index ${idx}.`);
        console.log('Surrounding window:', text.substring(Math.max(0, idx - 100), Math.min(text.length, idx + 100)));
      } else {
        console.log(`Keyword "${kw}" NOT found.`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

test();
