export interface ToolMetaData {
  id: string;
  name: string;
  category: 'pdf' | 'image' | 'converter' | 'security' | 'ai' | 'automation' | 'legal' | 'directory';
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  canonicalUrl: string;
  path: string;
  iconName: string;
  badge?: string;
  features: string[];
  benefits: string[];
  instructions: string[];
  faqs: { question: string; answer: string }[];
  longContent: string;
}

export const BASE_URL = 'https://convert-verse-8l9l.vercel.app';

export const TOOLS_REGISTRY: Record<string, ToolMetaData> = {
  'dashboard': {
    id: 'dashboard',
    name: 'ConvertVerse Workstation Dashboard',
    category: 'ai',
    shortDescription: 'All-in-one local file conversion, PDF management, and image editing hub.',
    seoTitle: 'ConvertVerse | Free Online PDF & Image Converter Workstation',
    seoDescription: 'ConvertVerse is a private, 100% browser-based utility platform to compress images, edit PDFs, convert formats, and optimize media files locally.',
    keywords: ['file converter online', 'free pdf compressor', 'local image resizer', 'browser file utility', 'privacy first converter'],
    path: '/dashboard',
    canonicalUrl: `${BASE_URL}/dashboard`,
    iconName: 'LayoutDashboard',
    badge: 'Popular',
    features: [
      '100% Serverless & Private Processing',
      'Instant Batch Operations',
      'Drag & Drop Multi-file Queue',
      'No File Size Limits or Sign-up',
      'Offline PWA Capabilities'
    ],
    benefits: [
      'Maximum Confidentiality: Files stay on your physical device',
      'Zero Cloud Lag: Instant conversion using WebAssembly & WebWorkers',
      'Universal Access: Works across Chrome, Firefox, Safari, Edge & Mobile'
    ],
    instructions: [
      'Select any utility tool from the navigation bar or dashboard cards.',
      'Drag and drop your files into the local processing zone.',
      'Adjust settings such as compression level, dimensions, or password protection.',
      'Click process and download your instant results.'
    ],
    faqs: [
      {
        question: 'Are my files uploaded to any server?',
        answer: 'No. ConvertVerse operates entirely client-side using JavaScript, WebAssembly, and WebWorkers. Your files never touch a remote server.'
      },
      {
        question: 'Is ConvertVerse completely free to use?',
        answer: 'Yes, ConvertVerse is 100% free with no file limits, hidden paywalls, or mandatory user registrations.'
      }
    ],
    longContent: `ConvertVerse is designed from the ground up as a high-speed, client-side workstation that eliminates privacy concerns associated with traditional online file processing. Standard cloud converters transmit your documents over public networks to external servers, creating risks of exposure, unauthorized storage, or security breaches. ConvertVerse solves this by performing 100% of computations natively inside your web browser.`
  },
  'image-tools': {
    id: 'image-tools',
    name: 'Image Tools Suite',
    category: 'image',
    shortDescription: 'Compress JPEGs/PNGs, resize by DPI metrics, convert HEIC to JPG, and scrub EXIF metadata.',
    seoTitle: 'Online Image Resizer, Compressor & HEIC Converter | ConvertVerse',
    seoDescription: 'Batch compress image files, resize with physical metric DPI controls (in/cm/mm), decode Apple HEIC photos, and scrub EXIF data locally.',
    keywords: ['image compressor online', 'online image resizer', 'HEIC to JPG converter', 'EXIF metadata scrubber', 'DPI metric resizer'],
    path: '/image-tools',
    canonicalUrl: `${BASE_URL}/image-tools`,
    iconName: 'Image',
    badge: 'Popular',
    features: [
      'Metric DPI Physical Print Resizer (Inches, Centimeters, Millimeters)',
      'Adjustable Compression Presets with Structural Integrity Preservation',
      'Apple HEIC / HEIF to Web-friendly JPEG Decoder',
      'Canvas EXIF Tracker & Metadata Scrubber',
      'Batch Image Renaming & WebP / AVIF Export'
    ],
    benefits: [
      'Optimizes Web Vitals and page load speeds by shrinking image payloads.',
      'Prepares artwork for physical print with exact metric measurements.',
      'Protects personal location privacy by scrubbing photo EXIF tags.'
    ],
    instructions: [
      'Drop your images or HEIC files into the upload box.',
      'Select your operation: Compress, Metric Resize, Format Convert, or Scrub Metadata.',
      'Fine-tune resolution, DPI, or target quality sliders.',
      'Download your optimized images individually or as a compressed ZIP file.'
    ],
    faqs: [
      {
        question: 'How does the physical metric print resizer work?',
        answer: 'By combining target physical dimensions (inches/cm/mm) with target DPI (e.g. 300 DPI for print), our algorithm calculates exact pixel dimensions for crystal-clear physical printing.'
      }
    ],
    longContent: `The ConvertVerse Image Suite gives digital creators, photographers, web developers, and designers complete control over graphic assets.`
  },
  'resize-image': {
    id: 'resize-image',
    name: 'Resize Image (Pixels & Metric DPI)',
    category: 'image',
    shortDescription: 'Resize photos by exact pixel dimensions or physical print metrics (in, cm, mm) at 300 DPI.',
    seoTitle: 'Resize Image Online - Metric DPI & Pixel Image Resizer',
    seoDescription: 'Resize images by pixels or physical print units (inches, cm, mm) with custom DPI settings for crystal clear printing.',
    keywords: ['resize image online', 'image resizer in cm', 'resize photo inches 300 dpi', 'crop image online'],
    path: '/image-tools/resize-image',
    canonicalUrl: `${BASE_URL}/image-tools/resize-image`,
    iconName: 'Image',
    features: [
      'Physical Metric Resizing (Inches, Centimeters, Millimeters)',
      'Custom DPI Settings (72, 150, 300, 600 DPI)',
      'Aspect Ratio Lock & Percentage Scaling',
      'Instant HTML5 Canvas Rendering'
    ],
    benefits: [
      'Accurately size images for physical prints, passport photos, and posters.',
      'Prevent distorted photos by maintaining aspect ratio lock.'
    ],
    instructions: [
      'Upload your image.',
      'Select unit (Pixels, Inches, Centimeters, Millimeters) and set target DPI.',
      'Click Resize Image to download.'
    ],
    faqs: [
      {
        question: 'What DPI should I use for printing photos?',
        answer: 'Standard high-resolution printing requires 300 DPI.'
      }
    ],
    longContent: `Sizing artwork for physical print requires converting real-world physical measurements into digital pixel allocations.`
  },
  'compress-image': {
    id: 'compress-image',
    name: 'Compress Image Online',
    category: 'image',
    shortDescription: 'Shrink JPEG, PNG, WebP, and AVIF image sizes up to 80% with lossless visual quality.',
    seoTitle: 'Compress Image Online - Reduce Photo File Size Free',
    seoDescription: 'Batch compress JPG, PNG, and WebP images locally inside your browser. Save bandwidth and improve website loading speed.',
    keywords: ['compress image', 'shrink photo size', 'reduce image MB to KB', 'batch image compressor'],
    path: '/image-tools/compress-image',
    canonicalUrl: `${BASE_URL}/image-tools/compress-image`,
    iconName: 'Image',
    features: [
      'Lossless & Lossy Compression Sliders',
      'Batch Image Processing Queue',
      'Real-time Side-by-Side SSIM Quality Comparison',
      '100% Browser Processing'
    ],
    benefits: [
      'Drastically reduce webpage loading times and pass Lighthouse performance audits.'
    ],
    instructions: [
      'Upload images to compress.',
      'Adjust compression percentage or target file size.',
      'Click Compress Images to download.'
    ],
    faqs: [
      {
        question: 'Will image compression degrade visual quality?',
        answer: 'Our adaptive compression algorithms preserve key visual features while stripping redundant color data.'
      }
    ],
    longContent: `Optimizing photo weights is key to fast web performance.`
  },
  'remove-background': {
    id: 'remove-background',
    name: 'Remove Background & Censor Shield',
    category: 'image',
    shortDescription: 'Censor sensitive details, apply region blurs, and isolate image elements locally.',
    seoTitle: 'Remove Background & Image Censor Blur Tool | ConvertVerse',
    seoDescription: 'Censor face details, blur sensitive regions, and clean photo backgrounds with 100% browser privacy.',
    keywords: ['remove background', 'image censor blur', 'blur face online', 'privacy shield image'],
    path: '/image-tools/remove-background',
    canonicalUrl: `${BASE_URL}/image-tools/remove-background`,
    iconName: 'ShieldCheck',
    features: [
      'Facial Quadrant Privacy Censor Blur',
      'Canvas Metadata Scrubbing',
      'Client-Side Image Manipulation'
    ],
    benefits: [
      'Protects personal identities in photos before sharing.'
    ],
    instructions: [
      'Upload your image file.',
      'Select blur region and apply censor effect.'
    ],
    faqs: [
      {
        question: 'Is my photo saved on a server?',
        answer: 'No. The blur effect is rendered entirely in HTML5 Canvas memory.'
      }
    ],
    longContent: `Protect personal details in your photos with local blur tools.`
  },
  'pdf-tools': {
    id: 'pdf-tools',
    name: 'PDF Tools Workstation',
    category: 'pdf',
    shortDescription: 'Merge, split, extract pages, rotate, and add vector page numbers to PDF files.',
    seoTitle: 'Free Online PDF Merger, Splitter & Visual Page Editor | ConvertVerse',
    seoDescription: 'Merge PDF files, split pages using custom ranges, rotate layouts, and add page numbers in seconds. 100% local browser processing.',
    keywords: ['merge pdf online', 'split pdf free', 'pdf visual editor', 'add page numbers to pdf', 'rotate pdf pages'],
    path: '/pdf-tools',
    canonicalUrl: `${BASE_URL}/pdf-tools`,
    iconName: 'FileText',
    badge: 'Essential',
    features: [
      'Visual Drag & Drop Page Reordering',
      'Custom Range Splitting (e.g. 1, 3, 5-10)',
      'Vector Page Numbering with Custom Positioning',
      'Instant Local PDF Compression & Layout Rotation',
      'Extract High-Resolution Images from PDF'
    ],
    benefits: [
      'Keep legal and sensitive business documents strictly local.',
      'High-speed batch processing without network delays.'
    ],
    instructions: [
      'Upload one or multiple PDF documents.',
      'Choose your desired mode: Merge, Split, Page Numbers, or Rotate.',
      'Drag pages into your preferred order or specify page ranges.',
      'Click Process PDF to download.'
    ],
    faqs: [
      {
        question: 'Can I reorder pages before merging PDFs?',
        answer: 'Yes! Our visual grid allows you to preview and reorder individual pages from multiple documents before compiling.'
      }
    ],
    longContent: `The ConvertVerse PDF Toolbox provides a comprehensive suite of document management utilities operating directly in your web browser.`
  },
  'merge-pdf': {
    id: 'merge-pdf',
    name: 'Merge PDF Online',
    category: 'pdf',
    shortDescription: 'Combine multiple PDF files into one organized document with visual page drag-and-drop.',
    seoTitle: 'Merge PDF Files Online - Free Client-Side PDF Joiner',
    seoDescription: 'Combine multiple PDF files into a single document visually in your browser. Rearrange pages, preview layouts, and merge PDFs locally.',
    keywords: ['merge pdf', 'combine pdf files', 'pdf joiner online', 'merge pdf free', 'combine pdfs local'],
    path: '/pdf-tools/merge-pdf',
    canonicalUrl: `${BASE_URL}/pdf-tools/merge-pdf`,
    iconName: 'FileText',
    features: [
      'Visual Grid Page Reordering',
      'Multi-File PDF Combination',
      'Zero Cloud Upload Data Security',
      'Instant Local Assembly'
    ],
    benefits: [
      'Consolidate multiple report files or contracts into a single PDF.'
    ],
    instructions: [
      'Select multiple PDF files to merge.',
      'Drag and drop pages into your desired sequence.',
      'Click Merge PDF to compile.'
    ],
    faqs: [
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'There are no artificial limits. You can combine as many PDF files as your local memory allows.'
      }
    ],
    longContent: `Combining separate PDF files into a cohesive document is essential for professionals, students, and businesses.`
  },
  'split-pdf': {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    category: 'pdf',
    shortDescription: 'Extract specific pages or page ranges from PDF documents instantly.',
    seoTitle: 'Split PDF Online - Extract Pages Free in Browser',
    seoDescription: 'Extract individual pages or specified page ranges (e.g. 1, 3, 5-10) from PDF documents locally without uploading.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'split pdf online free'],
    path: '/pdf-tools/split-pdf',
    canonicalUrl: `${BASE_URL}/pdf-tools/split-pdf`,
    iconName: 'FileText',
    features: [
      'Intelligent Range Parsing (e.g. 1, 3, 5-10)',
      'Extract Single Pages to Individual PDFs',
      'Visual Page Preview Grid'
    ],
    benefits: [
      'Extract only necessary chapters or invoices from large PDF manuals.'
    ],
    instructions: [
      'Upload the PDF document you wish to split.',
      'Enter target page ranges or select thumbnail pages.',
      'Click Split PDF to download.'
    ],
    faqs: [
      {
        question: 'Can I split password-protected PDFs?',
        answer: 'Yes, as long as you provide the valid password locally to unlock page rendering.'
      }
    ],
    longContent: `Large PDF files often contain unnecessary pages. The ConvertVerse PDF Splitter provides precision page extraction.`
  },
  'compress-pdf': {
    id: 'compress-pdf',
    name: 'Compress PDF Files',
    category: 'pdf',
    shortDescription: 'Reduce PDF document file size locally while preserving crisp text vector quality.',
    seoTitle: 'Compress PDF Online - Reduce PDF File Size Free',
    seoDescription: 'Shrink large PDF documents locally in your browser memory. Ideal for email attachments and portal uploads.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf file', 'pdf compressor free'],
    path: '/pdf-tools/compress-pdf',
    canonicalUrl: `${BASE_URL}/pdf-tools/compress-pdf`,
    iconName: 'Minimize2',
    features: [
      'Local PDF Vector Stream Optimization',
      'Lossless Text & Image Downscaling',
      'Instant Storage Saving Calculations'
    ],
    benefits: [
      'Prepare large PDF documents under strict email attachment limits.'
    ],
    instructions: [
      'Upload your PDF file.',
      'Select compression preset.',
      'Click Compress PDF to download.'
    ],
    faqs: [
      {
        question: 'Does PDF compression alter text readability?',
        answer: 'No. Vector fonts and text streams remain crisp while embedded background graphics are optimized.'
      }
    ],
    longContent: `Shrink PDF sizes instantly in browser memory.`
  },
  'image-converter': {
    id: 'image-converter',
    name: 'Universal Image Converter',
    category: 'converter',
    shortDescription: 'Convert between WebP, PNG, JPEG, AVIF, HEIC, and BMP graphic formats.',
    seoTitle: 'Universal Image Converter | PNG, JPG, WebP, HEIC, AVIF',
    seoDescription: 'Convert image files locally between PNG, JPEG, WebP, AVIF, and HEIC formats with 100% browser privacy.',
    keywords: ['image converter', 'png to jpg', 'webp to png', 'heic to jpeg converter'],
    path: '/image-converter',
    canonicalUrl: `${BASE_URL}/image-converter`,
    iconName: 'RefreshCw',
    features: [
      'Multi-Format Image Batch Decoder',
      'Apple HEIC to Standard JPEG Converter',
      'Quality & Transparency Controls'
    ],
    benefits: [
      'Convert photos into web-ready formats in seconds.'
    ],
    instructions: [
      'Upload images.',
      'Select target format (JPG, PNG, WebP, AVIF) and convert.'
    ],
    faqs: [
      {
        question: 'Can I convert HEIC photos from iPhone locally?',
        answer: 'Yes! ConvertVerse includes a local WebAssembly HEIC decoder that converts Apple photos to JPEG directly in your browser.'
      }
    ],
    longContent: `Convert graphic assets across popular web image formats.`
  },
  'png-to-jpg': {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'converter',
    shortDescription: 'Convert transparent or heavy PNG files to lightweight JPEGs.',
    seoTitle: 'PNG to JPG Converter Online - Free & Private',
    seoDescription: 'Convert PNG images to JPEG format with customizable background fill color and compression controls.',
    keywords: ['png to jpg', 'convert png to jpeg', 'png2jpg free'],
    path: '/converters/png-to-jpg',
    canonicalUrl: `${BASE_URL}/converters/png-to-jpg`,
    iconName: 'RefreshCw',
    features: ['Instant PNG to JPG Conversion', 'Custom Background Color Picker', 'Batch Queue Processing'],
    benefits: ['Reduce file sizes by converting uncompressed PNGs into JPEGs.'],
    instructions: ['Select PNG files.', 'Click Convert to JPG.'],
    faqs: [{ question: 'What happens to PNG transparency?', answer: 'Transparency is automatically filled with a white background or your custom selected color.' }],
    longContent: `Convert PNG graphics to JPEG format for smaller web image payloads.`
  },
  'webp-to-png': {
    id: 'webp-to-png',
    name: 'WebP to PNG Converter',
    category: 'converter',
    shortDescription: 'Convert modern WebP images into full quality PNG graphics.',
    seoTitle: 'WebP to PNG Converter Online - Preserve Transparency',
    seoDescription: 'Convert WebP images to PNG format instantly while preserving full alpha channel transparency.',
    keywords: ['webp to png', 'convert webp to png', 'webp2png free'],
    path: '/converters/webp-to-png',
    canonicalUrl: `${BASE_URL}/converters/webp-to-png`,
    iconName: 'RefreshCw',
    features: ['Full Alpha Channel Transparency Support', 'Lossless PNG Export', 'Instant Browser Rendering'],
    benefits: ['Use WebP images in design applications that require standard PNG files.'],
    instructions: ['Select WebP files.', 'Click Convert to PNG.'],
    faqs: [{ question: 'Is image quality preserved during conversion?', answer: 'Yes, WebP to PNG conversion preserves visual fidelity and transparency.' }],
    longContent: `Decode WebP images back into versatile PNG assets.`
  },
  'pdf-editor': {
    id: 'pdf-editor',
    name: 'Visual PDF Page Editor',
    category: 'pdf',
    shortDescription: 'Rotate, reorder, delete, and visual grid editor for PDF pages.',
    seoTitle: 'Free Visual PDF Page Editor - Reorder & Rotate PDF Pages',
    seoDescription: 'Edit PDF layouts visually in your browser. Reorder pages, rotate page orientation, and delete unwanted pages.',
    keywords: ['pdf editor online', 'rotate pdf pages', 'reorder pdf pages', 'delete pdf pages free'],
    path: '/pdf-editor',
    canonicalUrl: `${BASE_URL}/pdf-editor`,
    iconName: 'FileText',
    features: ['Visual Drag & Drop Grid Layout', 'Page Rotation (90, 180, 270 degrees)', 'Delete & Duplicate Page Selections'],
    benefits: ['Fix upside-down scanned documents without downloading heavy desktop software.'],
    instructions: ['Upload your PDF file.', 'Drag thumbnails to reorder or click rotate buttons.', 'Export your edited PDF.'],
    faqs: [{ question: 'Can I rotate individual pages in a PDF?', answer: 'Yes! Each page thumbnail has independent rotation controls.' }],
    longContent: `Visual PDF page editing allows fixing document layouts directly in your browser.`
  },
  'pdf-security': {
    id: 'pdf-security',
    name: 'PDF Security & Protection',
    category: 'security',
    shortDescription: 'Encrypt PDF documents with passwords or unlock protected PDFs locally.',
    seoTitle: 'PDF Password Security - Encrypt & Unlock PDF Online',
    seoDescription: 'Protect PDF documents with owner/user passwords or unlock password-protected PDFs locally with complete confidentiality.',
    keywords: ['protect pdf password', 'encrypt pdf online', 'unlock pdf file', 'pdf security free'],
    path: '/pdf-security',
    canonicalUrl: `${BASE_URL}/pdf-security`,
    iconName: 'ShieldCheck',
    features: ['Standard 128-bit & 256-bit AES Encryption', 'Custom User & Master Password Configuration', 'Local Decryption & Unlocker'],
    benefits: ['Prevent unauthorized reading or printing of sensitive financial and legal PDFs.'],
    instructions: ['Select Encrypt or Unlock mode.', 'Upload your PDF file.', 'Set or enter password and process.'],
    faqs: [{ question: 'Are my PDF passwords stored anywhere?', answer: 'Never. All encryption and decryption occurs locally in your browser memory.' }],
    longContent: `Secure your confidential documents with local PDF security tools.`
  },
  'file-repair': {
    id: 'file-repair',
    name: 'File Repair & Recovery Center',
    category: 'automation',
    shortDescription: 'Inspect corrupted headers, repair malformed PDFs/images, and recover raw binary data.',
    seoTitle: 'File Repair & Header Recovery Center | ConvertVerse',
    seoDescription: 'Inspect corrupted file headers, fix malformed PDF boundaries, and recover raw image data locally in browser memory.',
    keywords: ['file repair online', 'corrupted pdf repair', 'fix image header', 'file recovery tool'],
    path: '/file-repair',
    canonicalUrl: `${BASE_URL}/file-repair`,
    iconName: 'Cpu',
    features: ['Magic Byte Header Scanner', 'PDF EOF & Trailer Reconstruction', 'Raw Image Stream Extractor'],
    benefits: ['Recover valuable documents corrupted during partial file downloads or email transmissions.'],
    instructions: ['Upload the corrupted file.', 'Select analysis mode and run repair scan.', 'Download recovered file.'],
    faqs: [{ question: 'What file types can be inspected?', answer: 'Supports PDF, JPEG, PNG, ZIP, and standard office document headers.' }],
    longContent: `Diagnose and recover damaged binary files using browser diagnostic engines.`
  },
  'collaboration': {
    id: 'collaboration',
    name: 'Real-Time Workspace Studio',
    category: 'ai',
    shortDescription: 'Collaborate locally, share memory sessions, and manage document queues.',
    seoTitle: 'Real-Time Collaboration & Local Workspace Studio',
    seoDescription: 'Organize project queues, stage document assets, and export shared memory packages without external tracking.',
    keywords: ['workspace studio', 'document collaboration', 'local session sharing'],
    path: '/collaboration',
    canonicalUrl: `${BASE_URL}/collaboration`,
    iconName: 'Workflow',
    features: ['Local Memory Session Manager', 'Project Queue Staging', 'Exportable Encrypted Worksheets'],
    benefits: ['Streamlines multi-document workflows in a single organized dashboard.'],
    instructions: ['Stage your project files in the workspace queue.', 'Apply actions across all staged assets.'],
    faqs: [{ question: 'Can I export my workspace state?', answer: 'Yes, workspace states can be exported into encrypted `.vault` sessions.' }],
    longContent: `Organize project assets efficiently using local workspace queues.`
  },
  'ai-content': {
    id: 'ai-content',
    name: 'AI Content Creator Studio',
    category: 'ai',
    shortDescription: 'Local document OCR scanner, text summarizer, and content formatting studio.',
    seoTitle: 'AI Content Creator Studio & Local OCR Text Scanner',
    seoDescription: 'Scan text from documents using local Tesseract.js OCR, analyze content structure, and format text outputs with complete privacy.',
    keywords: ['ai content creator', 'ocr text scanner', 'extract text from image', 'local text studio'],
    path: '/ai-content',
    canonicalUrl: `${BASE_URL}/ai-content`,
    iconName: 'Cpu',
    badge: 'AI Powered',
    features: ['Client-Side Tesseract.js OCR Engine', 'Multi-Language Document Recognition', 'Export Text to TXT, Markdown, or PDF'],
    benefits: ['Digitize printed books, receipts, and invoices without sending data to external AI servers.'],
    instructions: ['Upload document photo.', 'Select language and click Scan Text.'],
    faqs: [{ question: 'How accurate is the OCR engine?', answer: 'Achieves up to 98% accuracy on clear printed text documents.' }],
    longContent: `Extract and format text from image scans locally in your browser.`
  },
  'secure-vault': {
    id: 'secure-vault',
    name: 'AI Secure Vault',
    category: 'security',
    shortDescription: 'Encrypt files with AES-256 PBKDF2, blur faces, and create timed self-destruct memory links.',
    seoTitle: 'Client-Side AES-256 Crypto Vault & Privacy Shield',
    seoDescription: 'Encrypt files locally using military-grade AES-256 encryption, censor sensitive photo regions, and create self-destruct memory sharing links.',
    keywords: ['AES-256 file encryption', 'client side file vault', 'photo face censor blur', 'self destructing file link'],
    path: '/secure-vault',
    canonicalUrl: `${BASE_URL}/secure-vault`,
    iconName: 'ShieldCheck',
    badge: 'Security',
    features: ['Military-grade AES-GCM 256-bit Cryptography', '100,000 Iteration PBKDF2 Key Derivation', 'Facial Quadrant Privacy Blur', 'Timed Self-Destruct Memory Sharing'],
    benefits: ['Guarantees nobody can unlock files without your private passphrase.'],
    instructions: ['Select Encrypt File and set passphrase.', 'Download the derived `.vault` file.'],
    faqs: [{ question: 'What happens if I lose my vault passphrase?', answer: 'Passphrases are never saved anywhere. Lost passphrases cannot be recovered.' }],
    longContent: `ConvertVerse AI Secure Vault implements client-side AES-256 PBKDF2 encryption natively inside browser memory.`
  },
  'seo-tools': {
    id: 'seo-tools',
    name: 'SEO Media & Web Vitals Optimizer',
    category: 'ai',
    shortDescription: 'Audit Core Web Vitals, generate responsive HTML tags, design OG preview cards, and export favicon packages.',
    seoTitle: 'Smart SEO Media Optimizer & Core Web Vitals Auditor',
    seoDescription: 'Audit image Web Vitals, generate responsive picture tags with lazy loading, build Open Graph cards, and compile favicon packages instantly.',
    keywords: ['Core Web Vitals image audit', 'Open Graph card designer', 'favicon generator online', 'responsive picture tag compiler'],
    path: '/seo-tools',
    canonicalUrl: `${BASE_URL}/seo-tools`,
    iconName: 'Sparkles',
    features: ['Core Web Vitals Image Impact Auditor', 'Automated Alt Tag Generator & HTML Picture Stack Compiler', '1.91:1 Widescreen Open Graph Card Designer', 'Multi-Format Favicon ZIP Builder'],
    benefits: ['Improves Google PageSpeed Insights and search engine rankings.'],
    instructions: ['Upload image or logo.', 'Review audit score and copy generated HTML picture tags.'],
    faqs: [{ question: 'Does this tool help pass Google Lighthouse audits?', answer: 'Yes! It flags heavy legacy images and exports responsive HTML picture tags with loading="lazy".' }],
    longContent: `Evaluate image weights and generate responsive HTML code blocks for superior Web Vitals.`
  },
  'batch-tools': {
    id: 'batch-tools',
    name: 'Batch Automation Studio',
    category: 'automation',
    shortDescription: 'Build multi-step automated workflows to rename, watermark, resize, and convert files in batch.',
    seoTitle: 'Batch Automation Studio | Sequential File Pipeline Builder',
    seoDescription: 'Construct offline batch workflow pipelines to resize, rename, overlay watermarks, and compress hundreds of files automatically.',
    keywords: ['batch file processing', 'automated workflow builder', 'batch image watermark', 'batch file renamer'],
    path: '/batch-tools',
    canonicalUrl: `${BASE_URL}/batch-tools`,
    iconName: 'Workflow',
    features: ['Drag & Drop Workflow Pipeline Builder', 'Sequential Action Chaining (Rename -> Watermark -> Compress)', 'Automated ZIP Archive Compiler'],
    benefits: ['Automates repetitive photo and document editing tasks.'],
    instructions: ['Add processing steps to pipeline.', 'Click Run Batch Pipeline.'],
    faqs: [{ question: 'How many files can I process in a batch workflow?', answer: 'Process hundreds of files simultaneously in browser memory.' }],
    longContent: `Construct sequential pipelines to rename, watermark, and resize images automatically.`
  },
  'converter': {
    id: 'converter',
    name: 'Converter Center',
    category: 'converter',
    shortDescription: 'Convert between PDF, Word, TXT, HTML, JSON, CSV, and image formats.',
    seoTitle: 'Universal File Converter | PDF, DOCX, TXT, HTML, JSON, Images',
    seoDescription: 'Convert documents and media between PDF, Word, TXT, HTML, JSON, and image formats instantly in your browser with complete privacy.',
    keywords: ['universal file converter', 'pdf to text', 'word to pdf online', 'json to csv converter'],
    path: '/converter',
    canonicalUrl: `${BASE_URL}/converter`,
    iconName: 'RefreshCw',
    features: ['Multi-format Universal Document & Media Converter', 'Text Extraction & Document Compilation', 'Batch File Processing'],
    benefits: ['One tool for all document and data conversions.'],
    instructions: ['Upload your file.', 'Select output format and click Convert.'],
    faqs: [{ question: 'Does document conversion alter original layouts?', answer: 'Our conversion algorithms preserve paragraph structures as closely as possible.' }],
    longContent: `The Converter Center handles client-side format transformations between PDF, Word, TXT, HTML, and JSON.`
  },
  'tools': {
    id: 'tools',
    name: 'All Tools Directory',
    category: 'directory',
    shortDescription: 'Complete index of ConvertVerse browser utility tools.',
    seoTitle: 'All Utility Tools Directory | ConvertVerse Workstation',
    seoDescription: 'Browse the full index of 20+ free, client-side PDF, image, security, OCR, and conversion tools.',
    keywords: ['convertverse tools list', 'pdf tools directory', 'free online file utilities'],
    path: '/tools',
    canonicalUrl: `${BASE_URL}/tools`,
    iconName: 'LayoutDashboard',
    features: ['Full Directory Index of All 20+ Utilities', 'Categorized Tool Navigation', 'Instant Search Filter'],
    benefits: ['Find the exact file processing tool you need in seconds.'],
    instructions: ['Browse categories or search for a specific tool.'],
    faqs: [{ question: 'Are all tools on ConvertVerse free?', answer: 'Yes! All tools run client-side without registration or subscriptions.' }],
    longContent: `Explore our full directory of local browser utilities.`
  },
  'categories': {
    id: 'categories',
    name: 'Tool Categories Index',
    category: 'directory',
    shortDescription: 'Browse ConvertVerse tools by functional category.',
    seoTitle: 'Tool Categories Index | PDF, Image, Security & AI Suites',
    seoDescription: 'Explore ConvertVerse utilities organized by category: PDF Tools, Image Suite, Converters, AI Vault, Automation, and Legal pages.',
    keywords: ['convertverse categories', 'pdf tools category', 'image tools category'],
    path: '/categories',
    canonicalUrl: `${BASE_URL}/categories`,
    iconName: 'Folder',
    features: ['Categorized View of All Features', 'Direct Navigation Links'],
    benefits: ['Navigate to tool groups easily.'],
    instructions: ['Click on any category to view its associated tools.'],
    faqs: [{ question: 'How are tools categorized?', answer: 'Tools are grouped by primary file type and processing function.' }],
    longContent: `Browse ConvertVerse software suites by category.`
  },
  'search': {
    id: 'search',
    name: 'Tool Search Center',
    category: 'directory',
    shortDescription: 'Search for any PDF, image, security, or conversion tool.',
    seoTitle: 'Search Utility Tools | ConvertVerse Workstation',
    seoDescription: 'Search the ConvertVerse workstation to quickly find PDF splitters, image resizers, format converters, and security tools.',
    keywords: ['search convertverse', 'find pdf tool', 'image utility search'],
    path: '/search',
    canonicalUrl: `${BASE_URL}/search`,
    iconName: 'Search',
    features: ['Real-time Fast Search Filter', 'Keyword & Feature Matching'],
    benefits: ['Instantly locate the tool matching your requirement.'],
    instructions: ['Type tool name or file format into the search box.'],
    faqs: [{ question: 'Can I search by file extension?', answer: 'Yes! Searching for "PNG", "HEIC", or "PDF" returns relevant tools.' }],
    longContent: `Use our instant search index to locate utilities.`
  },
  'blog': {
    id: 'blog',
    name: 'Technical Blog & Guides',
    category: 'legal',
    shortDescription: 'Guides, technical tutorials, and articles on file security and web performance.',
    seoTitle: 'ConvertVerse Blog | WebAssembly, Privacy & SEO Guides',
    seoDescription: 'Read technical articles, privacy guides, and tutorials on client-side WebAssembly conversion, Core Web Vitals, and PDF management.',
    keywords: ['convertverse blog', 'pdf editing guides', 'client side processing article'],
    path: '/blog',
    canonicalUrl: `${BASE_URL}/blog`,
    iconName: 'FileText',
    features: ['In-depth Technical Articles', 'Core Web Vitals Optimization Guides', 'Data Privacy Tutorials'],
    benefits: ['Learn how to optimize files and maintain data security.'],
    instructions: ['Read our published articles below.'],
    faqs: [{ question: 'Are blog articles updated regularly?', answer: 'Yes! We publish quarterly updates on web performance and browser crypto.' }],
    longContent: `Welcome to the ConvertVerse technical blog and guide repository.`
  },
  'help': {
    id: 'help',
    name: 'Help & Support Center',
    category: 'legal',
    shortDescription: 'Frequently asked questions, browser troubleshooting, and user documentation.',
    seoTitle: 'Help & Support Center | ConvertVerse Workstation',
    seoDescription: 'Find troubleshooting guides, browser compatibility specs, and answers to common questions about ConvertVerse.',
    keywords: ['convertverse help', 'pdf converter support', 'troubleshooting guide'],
    path: '/help',
    canonicalUrl: `${BASE_URL}/help`,
    iconName: 'HelpCircle',
    features: ['Comprehensive Troubleshooting Guide', 'Browser WebAssembly Compatibility Specs'],
    benefits: ['Resolve operational questions quickly.'],
    instructions: ['Select a help topic or search our FAQs.'],
    faqs: [{ question: 'Which browsers are supported?', answer: 'ConvertVerse works on modern Chrome, Firefox, Safari, Edge, and mobile browsers.' }],
    longContent: `Get help and technical support for ConvertVerse browser tools.`
  },
  'about': {
    id: 'about',
    name: 'About ConvertVerse',
    category: 'legal',
    shortDescription: 'Learn about ConvertVerse zero-knowledge serverless file processing mission.',
    seoTitle: 'About ConvertVerse - 100% Local Serverless Workstation',
    seoDescription: 'Discover how ConvertVerse revolutionizes online file utilities by running 100% of PDF editing, image compression, and format conversions in your browser.',
    keywords: ['about convertverse', 'local browser converter', 'serverless file utility', 'privacy first software'],
    path: '/about',
    canonicalUrl: `${BASE_URL}/about`,
    iconName: 'Info',
    features: ['100% Private Client-Side Compute Model', 'Zero Cloud Server Storage', 'Modern WebAssembly & WebWorker Engines'],
    benefits: ['Complete peace of mind when working with confidential files.'],
    instructions: ['Explore our full suite of local tools directly from the main navigation.'],
    faqs: [{ question: 'Why is client-side file processing safer than cloud converters?', answer: 'Cloud converters require uploading your files to remote third-party servers. ConvertVerse processes everything inside your browser sandbox.' }],
    longContent: `ConvertVerse was created to solve privacy and efficiency problems associated with online file tools.`
  },
  'contact': {
    id: 'contact',
    name: 'Contact Us',
    category: 'legal',
    shortDescription: 'Get in touch with the ConvertVerse developer team.',
    seoTitle: 'Contact Us | ConvertVerse Workstation',
    seoDescription: 'Contact the ConvertVerse development team for feedback, feature requests, or technical inquiries.',
    keywords: ['contact convertverse', 'convertverse support email', 'developer feedback'],
    path: '/contact',
    canonicalUrl: `${BASE_URL}/contact`,
    iconName: 'Mail',
    features: ['Direct Email Support Channel', 'GitHub Issue Tracker Link'],
    benefits: ['Provide feedback or report bugs directly to our team.'],
    instructions: ['Fill out the contact form or send us an email.'],
    faqs: [{ question: 'How quickly do you respond to support inquiries?', answer: 'We typically respond within 24-48 business hours.' }],
    longContent: `We welcome feedback, feature suggestions, and technical inquiries.`
  },
  'privacy-policy': {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    category: 'legal',
    shortDescription: 'ConvertVerse strict privacy policy explaining 100% local processing.',
    seoTitle: 'ConvertVerse Privacy Policy - 100% Private & Serverless',
    seoDescription: 'Read the ConvertVerse Privacy Policy. We store zero user files, track zero personal data, and process everything locally in your browser sandbox.',
    keywords: ['privacy policy', 'convertverse privacy', 'zero logging policy', 'data protection'],
    path: '/privacy-policy',
    canonicalUrl: `${BASE_URL}/privacy-policy`,
    iconName: 'ShieldCheck',
    features: ['Zero Server File Upload Policy', 'Zero Personal Data Collection', 'No Mandatory Registration'],
    benefits: ['Your documents stay 100% confidential and owned by you.'],
    instructions: ['Read our full privacy commitments below.'],
    faqs: [{ question: 'Do you use tracking cookies to store uploaded files?', answer: 'No. We do not store or transmit any uploaded files. All processing occurs temporarily in your browser RAM.' }],
    longContent: `Privacy is the foundational core of ConvertVerse. We guarantee that zero document data is uploaded to remote servers.`
  },
  'terms': {
    id: 'terms',
    name: 'Terms of Service',
    category: 'legal',
    shortDescription: 'Terms of Service governing the use of ConvertVerse serverless utilities.',
    seoTitle: 'Terms of Service - ConvertVerse Local Workstation',
    seoDescription: 'Review the Terms of Service for using ConvertVerse free browser-based PDF and image utility tools.',
    keywords: ['terms of service', 'convertverse terms', 'user agreement'],
    path: '/terms',
    canonicalUrl: `${BASE_URL}/terms`,
    iconName: 'FileText',
    features: ['Free Unlimited Fair-Use License', 'No Hidden Fees or Subscription Caps', 'Client-Side Execution Agreement'],
    benefits: ['Use all utilities for personal or commercial projects without payment.'],
    instructions: ['Review terms of use for personal and commercial usage.'],
    faqs: [{ question: 'Can I use ConvertVerse for commercial business projects?', answer: 'Yes! ConvertVerse is free for both personal and commercial use.' }],
    longContent: `By using ConvertVerse, you agree to these fair-use terms of service.`
  }
};

export function resolveToolByPath(pathname: string): ToolMetaData {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  for (const key of Object.keys(TOOLS_REGISTRY)) {
    const tool = TOOLS_REGISTRY[key];
    if (tool.path === normalized) {
      return tool;
    }
  }

  // Fallbacks for sub-paths or legacy mappings
  if (normalized === '/' || normalized === '/dashboard') return TOOLS_REGISTRY['dashboard'];
  if (normalized.startsWith('/pdf')) return TOOLS_REGISTRY['pdf-tools'];
  if (normalized.startsWith('/image')) return TOOLS_REGISTRY['image-tools'];
  if (normalized.startsWith('/converters')) return TOOLS_REGISTRY['image-converter'];

  return TOOLS_REGISTRY['dashboard'];
}
