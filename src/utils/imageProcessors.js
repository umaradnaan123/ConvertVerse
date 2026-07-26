import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

// Format bytes into human readable format (e.g. 1.24 MB)
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Convert physical units into pixel units based on selected DPI
export function convertToPixels(value, unit, dpi = 300) {
  const val = parseFloat(value);
  if (isNaN(val)) return 0;
  
  switch (unit) {
    case 'px':
      return Math.round(val);
    case 'pct': // Percentage is handled relative to the original dimension directly
      return val;
    case 'in':
      return Math.round(val * dpi);
    case 'cm':
      return Math.round((val / 2.54) * dpi);
    case 'mm':
      return Math.round((val / 25.4) * dpi);
    default:
      return Math.round(val);
  }
}

// Convert pixels back into physical units for previewing
export function convertFromPixels(pixels, unit, dpi = 300) {
  const px = parseFloat(pixels);
  if (isNaN(px)) return 0;

  switch (unit) {
    case 'px':
      return Math.round(px);
    case 'in':
      return parseFloat((px / dpi).toFixed(2));
    case 'cm':
      return parseFloat(((px / dpi) * 2.54).toFixed(2));
    case 'mm':
      return Math.round((px / dpi) * 25.4);
    default:
      return px;
  }
}

// Convert Apple HEIC to standard JPEG/PNG
export async function convertHeicToAny(file, targetFormat = 'image/jpeg') {
  try {
    const blob = await heic2any({
      blob: file,
      toType: targetFormat,
      quality: 0.85
    });
    
    // heic2any can return a Blob or an Array of Blobs
    const resultBlob = Array.isArray(blob) ? blob[0] : blob;
    
    return new File(
      [resultBlob], 
      file.name.replace(/\.[^/.]+$/, "") + (targetFormat === 'image/png' ? '.png' : '.jpg'), 
      { type: targetFormat }
    );
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error("Unable to parse Apple HEIC file. Ensure the file is not corrupted.", { cause: error });
  }
}

// Real-time output file size estimator (math model)
export function estimateOutputSize(width, height, format, quality = 80) {
  const qFactor = quality / 100;
  let bytesPerPixel = 0.15; // default jpeg BPP
  
  if (format.includes('png')) {
    bytesPerPixel = 0.40; // Lossless PNG higher average BPP
  } else if (format.includes('webp')) {
    bytesPerPixel = 0.08; // High-efficiency WEBP BPP
  } else if (format.includes('bmp')) {
    bytesPerPixel = 3.0; // BMP raw 24-bit uncompressed
  }

  // Linear estimation based on resolution, quality factor, and format density
  const totalPixels = width * height;
  const estimatedSize = totalPixels * bytesPerPixel * qFactor;
  return Math.round(estimatedSize);
}

// Compress single image using browser-image-compression
export async function compressImage(file, options = {}) {
  const defaultOptions = {
    maxSizeMB: 10,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: 0.8
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const compressedBlob = await imageCompression(file, mergedOptions);
    return new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now()
    });
  } catch (error) {
    console.error("Image compression failed:", error);
    throw error;
  }
}

// Custom canvas resize for exact layout crops or filters
export function resizeWithCanvas(imageElement, targetWidth, targetHeight, targetType = 'image/jpeg', quality = 0.85) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error("Could not acquire 2D context for resizing canvas."));
      return;
    }
    
    // High-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas blob extraction returned empty."));
      }
    }, targetType, quality);
  });
}

/**
 * Converts any browser-supported image file (PNG, WEBP, JPEG, HEIC, GIF) 
 * into a clean, flat JPEG Data URL with a white background and optional rotation.
 * This fixes raw WebP or alpha-channel transparency corruption inside jsPDF templates.
 * 
 * @param {File|Blob} file Image file
 * @param {number} rotation Rotation in degrees (0, 90, 180, 270)
 * @returns {Promise<string>} High-compatibility JPEG data URL
 */
export async function imageToPdfCompatibleDataUrl(file, rotation = 0) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const angleRad = (rotation * Math.PI) / 180;
        
        // Swap dimensions if rotated 90 or 270 degrees
        const isSwapped = (rotation / 90) % 2 !== 0;
        canvas.width = isSwapped ? height : width;
        canvas.height = isSwapped ? width : height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src); // Fail-safe fallback if canvas context fails
          return;
        }
        
        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Fill canvas with white background (in case of PNG/SVG transparency)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Translate context to center of canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        // Rotate context
        ctx.rotate(angleRad);
        // Draw image centered
        ctx.drawImage(img, -width / 2, -height / 2);
        
        // Export as standard high-quality JPEG for maximum PDF size efficiency
        const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
        resolve(dataUrl);
      } catch (error) {
        reject(new Error("Canvas layout mapping failed: " + error.message));
      }
    };
    
    img.onerror = () => {
      reject(new Error("Failed to load visual image asset into canvas."));
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read image byte arrays."));
    };
    reader.readAsDataURL(file);
  });
}

