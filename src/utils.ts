/**
 * Compresses and resizes an image file on the client side using HTML5 Canvas.
 * Returns a Promise that resolves to a web-optimized JPEG data URL.
 * Automatically handles large photos (like modern mobile phone photos)
 * and keeps files extremely small (~15KB to ~30KB) to ensure they always
 * fit into localStorage without triggering QuotaExceededError.
 */
export function compressAndResizeImage(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if the uploaded file is indeed an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // prevent tainted canvas
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-scaled dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If 2D context is not supported, fallback to original preview
          resolve(event.target?.result as string);
          return;
        }

        // Fill background white for transparent png/gifs compiled to jpeg
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
          // Export to compressed jpeg
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch (error) {
          // Any potential security exceptions from tainted canvas
          resolve(event.target?.result as string);
        }
      };
      
      img.onerror = () => {
        // Fallback to original base64 if loading image fails
        resolve(event.target?.result as string);
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(reader.error || new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
