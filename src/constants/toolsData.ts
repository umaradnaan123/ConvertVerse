export interface ToolMetaData {
  id: string;
  name: string;
  category: 'pdf' | 'image' | 'converter' | 'security' | 'ai' | 'automation';
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

export const BASE_URL = 'https://convert-verse-8l9l-k1jn1ubtw-umaradnaan123s-projects.vercel.app';

export const TOOLS_REGISTRY: Record<string, ToolMetaData> = {
  'dashboard': {
    id: 'dashboard',
    name: 'ConvertVerse Dashboard',
    category: 'ai',
    shortDescription: 'All-in-one local file conversion, PDF management, and image editing hub.',
    seoTitle: 'ConvertVerse | Free Online PDF & Image Converter Hub',
    seoDescription: 'ConvertVerse is a private, 100% browser-based utility platform to compress images, edit PDFs, convert formats, and optimize media files locally.',
    keywords: ['file converter online', 'free pdf compressor', 'local image resizer', 'browser file utility', 'privacy first converter'],
    path: '/',
    canonicalUrl: `${BASE_URL}/`,
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
      'Select any utility tool from the sidebar or dashboard cards.',
      'Drag and drop your files into the processing zone.',
      'Adjust settings such as compression level, dimensions, or password protection.',
      'Click convert/process and download your instant results.'
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
    longContent: `ConvertVerse is designed from the ground up as a high-speed, client-side workstation that eliminates privacy concerns associated with traditional online file processing. Standard cloud converters transmit your documents over public networks to external servers, creating risks of exposure, unauthorized storage, or security breaches. ConvertVerse solves this by performing 100% of computations natively inside your web browser.

Whether you need to compress high-resolution photography, split or visually merge contracts, scan images with Optical Character Recognition (OCR), or encrypt files with AES-256 PBKDF2 encryption, ConvertVerse delivers immediate results without requiring file uploads or subscriptions.`
  },
  'pdf': {
    id: 'pdf',
    name: 'PDF Toolbox',
    category: 'pdf',
    shortDescription: 'Merge, split, extract pages, rotate, and add vector page numbers to PDF files.',
    seoTitle: 'Free Online PDF Merger, Splitter & Visual Page Editor',
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
      'High-speed batch processing without network delays.',
      'Preserve crisp vector text and structural formatting.'
    ],
    instructions: [
      'Upload one or multiple PDF documents.',
      'Choose your desired mode: Merge, Split, Page Numbers, or Rotate.',
      'Drag pages into your preferred order or specify page ranges.',
      'Click Process PDF to download the final merged or split file.'
    ],
    faqs: [
      {
        question: 'Can I reorder pages before merging PDFs?',
        answer: 'Yes! Our visual drag-and-drop grid allows you to preview and reorder individual pages from multiple documents before compiling.'
      },
      {
        question: 'What page range syntax is supported for PDF splitting?',
        answer: 'You can input individual pages and ranges separated by commas, such as "1, 3, 5-8, 12".'
      }
    ],
    longContent: `The ConvertVerse PDF Toolbox provides a comprehensive suite of document management utilities operating directly in your web browser. Utilizing modern JavaScript PDF parsing engines (PDF-Lib and PDF.js), this tool handles multi-page documents with precision and efficiency.

Managing contracts, report assemblies, e-books, and academic papers is effortless. You can merge disparate documents into a unified file, split voluminous manuscripts into concise chapters, rotate inverted scans, and stamp precise vector page numbering without relying on third-party PDF server infrastructure.`
  },
  'image-tools': {
    id: 'image-tools',
    name: 'Image Suite',
    category: 'image',
    shortDescription: 'Compress JPEGs/PNGs, resize by DPI metrics, convert HEIC to JPG, and scrub EXIF metadata.',
    seoTitle: 'Online Image Resizer, Compressor & HEIC Converter',
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
      },
      {
        question: 'Does Apple HEIC conversion happen locally?',
        answer: 'Yes! HEIC photos are decoded directly inside your browser sandbox using client WebWorkers without sending data to external cloud decoders.'
      }
    ],
    longContent: `The ConvertVerse Image Suite gives digital creators, photographers, web developers, and designers complete control over graphic assets. High-resolution images often degrade web performance or fail to meet strict print upload guidelines. ConvertVerse resolves both challenges through intelligent browser-side image processing algorithms.

Our metric resizer converts real-world physical measurements (in, cm, mm) into exact digital pixel allocations based on standard DPI scales (72, 150, 300, 600 DPI). The batch compressor reduces image file sizes by up to 80% while retaining structural fidelity. Additionally, privacy-focused creators can strip EXIF location data, camera serial numbers, and timestamps prior to public sharing.`
  },
  'universal-compressor': {
    id: 'universal-compressor',
    name: 'Universal Compressor',
    category: 'automation',
    shortDescription: 'Compress images, PDFs, document files, and audio assets in one batch queue.',
    seoTitle: 'Universal Batch File Compressor | Reduce PDF & Image Sizes',
    seoDescription: 'Shrink file sizes for images, PDFs, and media documents in a unified batch queue. Instant local compression without loss of quality.',
    keywords: ['universal file compressor', 'batch pdf shrinker', 'compress multiple images', 'reduce document size online'],
    path: '/universal-compressor',
    canonicalUrl: `${BASE_URL}/universal-compressor`,
    iconName: 'Minimize2',
    features: [
      'Multi-Format Batch File Queue',
      'Smart Compression Level Sliders',
      'Instant Storage Saving Calculations',
      'ZIP Archive Auto-Packer'
    ],
    benefits: [
      'Saves local disk space and network bandwidth.',
      'Prepares large email attachments under strict size caps.',
      'Accelerates cloud backups and web uploads.'
    ],
    instructions: [
      'Drag and drop any collection of files into the Universal Compressor.',
      'Choose light, balanced, or aggressive compression.',
      'Click Compress All Files to process the queue.',
      'Save compressed files in a single ZIP container.'
    ],
    faqs: [
      {
        question: 'Can I compress different file types at the same time?',
        answer: 'Yes! The Universal Compressor handles PDFs, JPEGs, PNGs, and document formats simultaneously.'
      }
    ],
    longContent: `Handling mismatched file types is effortless with the Universal Compressor. Instead of navigating to separate web tools for PDFs, PNGs, and JPEGs, users can drag an entire folder into a unified batch queue. The engine detects file headers, applies format-specific compression routines, and generates a structured summary detailing exact bandwidth and disk storage saved.`
  },
  'ai-secure-vault': {
    id: 'ai-secure-vault',
    name: 'AI Secure Vault',
    category: 'security',
    shortDescription: 'Encrypt files with AES-256 PBKDF2, blur faces, and create timed self-destruct links.',
    seoTitle: 'Client-Side AES-256 Crypto Vault & Privacy Censor Shield',
    seoDescription: 'Encrypt files locally using military-grade AES-256 encryption, censor sensitive photo regions, and create self-destruct memory sharing links.',
    keywords: ['AES-256 file encryption', 'client side file vault', 'photo face censor blur', 'self destructing file link'],
    path: '/ai-secure-vault',
    canonicalUrl: `${BASE_URL}/ai-secure-vault`,
    iconName: 'ShieldCheck',
    badge: 'Security',
    features: [
      'Military-grade AES-GCM 256-bit Client Cryptography',
      '100,000 Iteration PBKDF2 Key Derivation',
      'Facial Quadrant & Document Region Privacy Blur',
      'Timed Self-Destruct Memory Object Sharing'
    ],
    benefits: [
      'Guarantees nobody can unlock files without your private passphrase.',
      'Protects personal identity in photos before public distribution.',
      'Prevents persistent file accumulation in browser cache.'
    ],
    instructions: [
      'Select Encrypt File and set a strong secret password.',
      'Download the derived `.vault` file envelope.',
      'To decrypt, re-upload the `.vault` file and enter your password.',
      'Use the Censor Blur tool to obscure faces or sensitive text.'
    ],
    faqs: [
      {
        question: 'What happens if I lose my vault passphrase?',
        answer: 'Because ConvertVerse uses strict client-side zero-knowledge encryption, passphrases are never stored anywhere. Lost passphrases cannot be recovered by anyone.'
      }
    ],
    longContent: `Privacy and security are non-negotiable when sharing confidential personal or business documents online. The ConvertVerse AI Secure Vault implements military-grade AES-GCM 256-bit encryption directly inside your browser using the native Web Crypto API. Password keys are strengthened through 100,000 PBKDF2 hashing iterations, creating cryptographic file containers that remain impenetrable against unauthorized access.`
  },
  'seo-media-optimizer': {
    id: 'seo-media-optimizer',
    name: 'SEO Media Optimizer',
    category: 'ai',
    shortDescription: 'Audit Core Web Vitals, generate responsive HTML tags, design OG preview cards, and export favicon packages.',
    seoTitle: 'Smart AI SEO Media Optimizer & Core Web Vitals Auditor',
    seoDescription: 'Audit image Web Vitals, generate responsive picture tags with lazy loading, build Open Graph cards, and compile favicon packages instantly.',
    keywords: ['Core Web Vitals image audit', 'Open Graph card designer', 'favicon generator online', 'responsive picture tag compiler'],
    path: '/seo-media-optimizer',
    canonicalUrl: `${BASE_URL}/seo-media-optimizer`,
    iconName: 'Sparkles',
    features: [
      'Core Web Vitals Image Impact Auditor',
      'Automated Alt Tag Generator & HTML Picture Stack Compiler',
      '1.91:1 Widescreen Open Graph Social Card Designer',
      'Multi-Format Favicon ZIP Builder (16x16, 32x32, 180x180)'
    ],
    benefits: [
      'Improves Google PageSpeed Insights and search rankings.',
      'Ensures attractive social sharing previews on LinkedIn, Twitter & Facebook.',
      'Generates essential web app icons in seconds.'
    ],
    instructions: [
      'Upload your target website image or brand logo.',
      'Review the Core Web Vitals performance analysis and suggestions.',
      'Customize title/description overlays to render Open Graph preview cards.',
      'Export responsive HTML picture stacks or download your compiled Favicon ZIP package.'
    ],
    faqs: [
      {
        question: 'Does this tool help pass Google Lighthouse audits?',
        answer: 'Yes! It flags unoptimized legacy images, recommends modern WebP/AVIF conversions, and exports responsive HTML picture tags with native loading="lazy" attributes.'
      }
    ],
    longContent: `Optimizing media assets for search engines is essential for modern web applications. The ConvertVerse SEO Media Optimizer acts as a virtual site reliability and SEO engineer. It analyzes raw image files, measures network payload weights, evaluates visual layout shift risks, and generates fully standards-compliant HTML snippets complete with modern web formats and accessible alt attributes.`
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
    features: [
      'Multi-format Universal Document & Media Converter',
      'Text Extraction & Document Compilation',
      'Batch File Processing',
      'Clean Formatting Preservation'
    ],
    benefits: [
      'One tool for all document and data conversions.',
      'Saves time by converting files in seconds locally.',
      'Free from file size restrictions.'
    ],
    instructions: [
      'Upload your document or file.',
      'Select target output format from the dropdown menu.',
      'Click Convert File to transform your document.',
      'Download your converted file instantly.'
    ],
    faqs: [
      {
        question: 'Does document conversion alter original layouts?',
        answer: 'Our conversion algorithms preserve paragraph structures, headers, and text formatting as closely as possible.'
      }
    ],
    longContent: `The Converter Center simplifies cross-format document workflow management. Transitioning files between formats—such as converting legacy text documents into structured PDFs, compiled HTML into readable plain text, or raw data into structured JSON—is handled directly in browser memory.`
  },
  'ai-document-toolkit': {
    id: 'ai-document-toolkit',
    name: 'AI Document Toolkit',
    category: 'ai',
    shortDescription: 'Optical Character Recognition (OCR) text scanner, document summarizer, and analysis tools.',
    seoTitle: 'Local OCR Scanner & AI Document Analysis Toolkit',
    seoDescription: 'Extract text from scanned images using client-side Tesseract.js OCR, analyze documents, and format extracted content locally.',
    keywords: ['local OCR scanner', 'image to text converter', 'extract text from scan', 'browser OCR tool'],
    path: '/ai-document-toolkit',
    canonicalUrl: `${BASE_URL}/ai-document-toolkit`,
    iconName: 'Cpu',
    badge: 'AI Powered',
    features: [
      'Client-Side Tesseract.js Optical Character Recognition (OCR)',
      'Multi-Language Text Scanning Support',
      'Instant Searchable Text & Code Extraction',
      'Export Scanned Text to TXT, PDF, or Clipboard'
    ],
    benefits: [
      'Digitize scanned documents, receipts, and book pages without privacy leaks.',
      'Zero subscription costs for OCR processing.',
      'Works offline once engine assets are cached.'
    ],
    instructions: [
      'Upload a scanned document, receipt, or photo containing text.',
      'Select recognition language.',
      'Click Scan Text with OCR to initiate recognition.',
      'Copy extracted text or export as TXT/PDF file.'
    ],
    faqs: [
      {
        question: 'How accurate is the browser OCR engine?',
        answer: 'Powered by Tesseract.js WebAssembly, our OCR engine delivers up to 98% accuracy on clear printed documents and receipts.'
      }
    ],
    longContent: `Extracting text from scanned documents, receipts, and images previously required sending sensitive paperwork to remote cloud OCR servers. The ConvertVerse AI Document Toolkit brings enterprise OCR capability directly into your browser using Tesseract.js WebAssembly compiled engines.`
  },
  'batch-automation': {
    id: 'batch-automation',
    name: 'Batch Automation Studio',
    category: 'automation',
    shortDescription: 'Build multi-step automated workflows to rename, watermark, resize, and convert files in batch.',
    seoTitle: 'Batch Automation Studio | Sequential File Pipeline Builder',
    seoDescription: 'Construct offline batch workflow pipelines to resize, rename, overlay watermarks, and compress hundreds of files automatically.',
    keywords: ['batch file processing', 'automated workflow builder', 'batch image watermark', 'batch file renamer'],
    path: '/batch-automation',
    canonicalUrl: `${BASE_URL}/batch-automation`,
    iconName: 'Workflow',
    features: [
      'Drag & Drop Workflow Pipeline Builder',
      'Sequential Action Chaining (Rename -> Watermark -> Compress)',
      'Custom Prefix & Incremental Index Suffix Rules',
      'Automated ZIP Archive Compiler'
    ],
    benefits: [
      'Automates repetitive photo and document editing tasks.',
      'Saves hours of manual file renaming and editing work.',
      'Executes locally with multi-core browser thread execution.'
    ],
    instructions: [
      'Add processing steps to your pipeline (e.g., Watermark, Resize, Rename).',
      'Configure parameters for each action step.',
      'Upload your batch file queue.',
      'Click Run Batch Pipeline to process and download your assets.'
    ],
    faqs: [
      {
        question: 'How many files can I process in a batch workflow?',
        answer: 'You can process hundreds of files simultaneously, limited only by your computer available RAM.'
      }
    ],
    longContent: `The Batch Automation Studio is designed for power users who manage large volumes of digital assets. By constructing sequential pipelines—such as applying text watermarks, resizing images to web specs, appending brand prefixes, and saving into structured ZIP archives—users eliminate hours of repetitive manual editing.`
  }
};

/**
 * Route path resolver mapping URL path (e.g. "/pdf-tools") to tool ID
 */
export function resolveToolByPath(pathname: string): ToolMetaData {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  for (const key of Object.keys(TOOLS_REGISTRY)) {
    const tool = TOOLS_REGISTRY[key];
    if (tool.path === normalized) {
      return tool;
    }
  }

  // Alias fallbacks for SEO friendly path variants
  if (normalized === '/pdf' || normalized === '/pdf-editor' || normalized === '/pdf-security') return TOOLS_REGISTRY['pdf'];
  if (normalized === '/image' || normalized === '/resizer' || normalized === '/compressor') return TOOLS_REGISTRY['image-tools'];
  if (normalized === '/dashboard') return TOOLS_REGISTRY['dashboard'];

  return TOOLS_REGISTRY['dashboard'];
}
