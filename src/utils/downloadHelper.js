import { saveAs } from 'file-saver';

// High-fidelity map of supported extensions to official MIME media types.
const MIME_MAP = {
  // Images
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'heic': 'image/heic',
  'heif': 'image/heif',
  'tiff': 'image/tiff',
  'bmp': 'image/bmp',
  'ico': 'image/x-icon',

  // Documents & Data
  'pdf': 'application/pdf',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'doc': 'application/msword',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xls': 'application/vnd.ms-excel',
  'csv': 'text/csv',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'ppt': 'application/vnd.ms-powerpoint',
  'txt': 'text/plain',
  'json': 'application/json',
  'html': 'text/html',
  'xml': 'application/xml',

  // Audio
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'ogg': 'audio/ogg',
  'm4a': 'audio/mp4',
  'aac': 'audio/aac',

  // Video
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo',

  // Archives
  'zip': 'application/zip',
  'rar': 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  'tar': 'application/x-tar',
  'gz': 'application/gzip'
};

/**
 * Validates a Blob, ArrayBuffer, or TypedArray before attempting download.
 * Ensures the exported file is not empty or corrupted.
 * @param {any} content 
 * @returns {boolean}
 */
export function validateFileContent(content) {
  if (content === null || content === undefined) return false;
  if (typeof content === 'string' && content.length === 0) return false;
  if (content instanceof Blob && content.size === 0) return false;
  if (content instanceof ArrayBuffer && content.byteLength === 0) return false;
  if (ArrayBuffer.isView(content) && content.byteLength === 0) return false;
  return true;
}

/**
 * Detects MIME type based on file extension.
 * Defaults to application/octet-stream if unknown.
 * @param {string} filename 
 * @param {string|null} explicitMime 
 * @returns {string}
 */
export function detectMimeType(filename, explicitMime = null) {
  if (explicitMime) return explicitMime;
  const parts = filename.split('.');
  if (parts.length <= 1) return 'application/octet-stream';
  const ext = parts.pop().toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

/**
 * Centralized, secure download utility.
 * Natively supports:
 * - Blob objects
 * - ArrayBuffers / TypedArrays
 * - base64 Data URLs (data:image/png;base64,...)
 * - Blob URLs (blob:http://localhost:5173/...)
 * 
 * @param {Blob|ArrayBuffer|Uint8Array|string} fileContent Binary file content or data/blob URL
 * @param {string} filename Target output file name (including extension)
 * @param {string} [explicitMime] Optional explicit MIME type override
 */
export function downloadBlob(fileContent, filename, explicitMime = null) {
  if (!validateFileContent(fileContent)) {
    throw new Error(`Cannot export empty or corrupted file content for "${filename}".`);
  }

  const mimeType = detectMimeType(filename, explicitMime);
  let blob = null;

  // Case 1: string inputs (Data URLs or Blob URLs)
  if (typeof fileContent === 'string') {
    if (fileContent.startsWith('data:')) {
      try {
        const parts = fileContent.split(',');
        const byteString = atob(parts[1]);
        const detectedMime = parts[0].split(':')[1].split(';')[0] || mimeType;
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        blob = new Blob([ab], { type: detectedMime });
      } catch (err) {
        console.error("Failed to decode base64 data URL:", err);
      }
    } else if (fileContent.startsWith('blob:')) {
      // It is already a formatted Blob URL, trigger direct DOM anchor click
      try {
        const link = document.createElement('a');
        link.href = fileContent;
        link.download = filename;
        link.style.display = 'none';
        link.style.opacity = '0';
        link.style.position = 'absolute';
        
        document.body.appendChild(link);
        
        try {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          link.dispatchEvent(clickEvent);
        } catch {
          link.click();
        }

        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 15000);
        return;
      } catch (err) {
        console.warn("Direct blob URL click failed, trying fallback:", err);
      }
    }
  }

  // Case 2: standard binary structures
  if (!blob) {
    if (fileContent instanceof ArrayBuffer || ArrayBuffer.isView(fileContent)) {
      blob = new Blob([fileContent], { type: mimeType });
    } else if (fileContent instanceof Blob) {
      blob = fileContent;
      if (!fileContent.type || fileContent.type === 'application/octet-stream') {
        blob = fileContent.slice(0, fileContent.size, mimeType);
      }
    } else if (typeof fileContent === 'string') {
      // Plain text or HTML fallback representation
      blob = new Blob([fileContent], { type: mimeType });
    }
  }

  if (!blob) {
    throw new Error("Unable to parse fileContent into valid binary structures.");
  }

  // 1. Primary Native anchor trigger to guarantee customized filename mapping
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    link.style.display = 'none';
    link.style.opacity = '0';
    link.style.position = 'absolute';
    
    document.body.appendChild(link);
    
    try {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      link.dispatchEvent(clickEvent);
    } catch {
      link.click();
    }

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 15000);
  } catch (nativeErr) {
    console.warn("Native anchor click download failed, calling file-saver:", nativeErr);
    // 2. Fallback to file-saver saveAs
    try {
      saveAs(blob, filename);
    } catch (fsErr) {
      console.error("All download systems failed:", fsErr);
    }
  }
}
