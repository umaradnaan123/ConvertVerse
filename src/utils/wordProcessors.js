import Tesseract from 'tesseract.js';

// Perform client-side Optical Character Recognition on an image file
export async function performOcr(imageFile, onProgress = () => {}) {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            onProgress(Math.round(m.progress * 100));
          } else {
            // E.g. "loading tesseract core" or "initializing api"
            onProgress(0);
          }
        }
      }
    );
    return result.data.text;
  } catch (error) {
    console.error("OCR execution failed:", error);
    throw new Error("Failed to scan visual text. Make sure the image is clear and contains text.", { cause: error });
  }
}

// Generate Microsoft Word (.doc) document from plain/rich text client-side
export function generateWordDocument(title, content) {
  // Convert standard newlines into paragraphs
  const cleanParagraphs = content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join('');

  // Special HTML format that Microsoft Word parses as a fully styled print document
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { 
          font-family: 'Calibri', 'Arial', sans-serif; 
          font-size: 11pt; 
          line-height: 1.6; 
          padding: 1.5in; 
          color: #2b2b2b;
        }
        h1 { 
          font-family: 'Century Gothic', 'Calibri', sans-serif; 
          font-size: 24pt; 
          color: #7c3aed; 
          margin-bottom: 6pt; 
          border-bottom: 2px solid #ede9fe; 
          padding-bottom: 8px; 
        }
        .meta-tag {
          font-size: 9pt;
          color: #6b7280;
          margin-bottom: 24pt;
        }
        p { 
          margin-bottom: 10pt; 
          text-align: justify; 
          text-justify: inter-word;
        }
        .footer { 
          margin-top: 40pt; 
          font-size: 8.5pt; 
          color: #9ca3af; 
          border-top: 1px solid #e5e7eb; 
          padding-top: 10px; 
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta-tag">
        Scanned & Compiled via ConvertVerse OCR AI on ${new Date().toLocaleDateString()}
      </div>
      
      <div class="document-content">
        ${cleanParagraphs || '<p><i>No characters or text scanned in the source document.</i></p>'}
      </div>
      
      <div class="footer">
        Generated 100% locally & securely by ConvertVerse in-browser utility. No server resources were consumed.
      </div>
    </body>
    </html>
  `;
  
  // Adding the byte-order mark (BOM) \ufeff for UTF-8 compatibility
  return new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
}
