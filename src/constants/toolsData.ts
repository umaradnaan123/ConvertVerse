export interface ToolMetaData {
  id: string;
  name: string;
  category: 'pdf' | 'image' | 'converter' | 'security' | 'ai' | 'automation' | 'legal';
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

export const BASE_URL = 'https://convert-verse.vercel.app';

export const TOOLS_REGISTRY: Record<string, ToolMetaData> = {
  'dashboard': {
    id: 'dashboard',
    name: 'ConvertVerse Workstation',
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
    longContent: `The ConvertVerse PDF Toolbox provides a comprehensive suite of document management utilities operating directly in your web browser. Utilizing modern JavaScript PDF parsing engines (PDF-Lib and PDF.js), this tool handles multi-page documents with precision and efficiency.`
  },
  'merge-pdf': {
    id: 'merge-pdf',
    name: 'Merge PDF Online',
    category: 'pdf',
    shortDescription: 'Combine multiple PDF files into one organized document with visual page drag-and-drop.',
    seoTitle: 'Merge PDF Files Online - Free Client-Side PDF Joiner',
    seoDescription: 'Combine multiple PDF files into a single document visually in your browser. Rearrange pages, preview layouts, and merge PDFs locally.',
    keywords: ['merge pdf', 'combine pdf files', 'pdf joiner online', 'merge pdf free', 'combine pdfs local'],
    path: '/merge-pdf',
    canonicalUrl: `${BASE_URL}/merge-pdf`,
    iconName: 'FileText',
    features: [
      'Visual Grid Page Reordering',
      'Multi-File PDF Combination',
      'Zero Cloud Upload Data Security',
      'Instant Local Assembly'
    ],
    benefits: [
      'Consolidate multiple report files or contracts into a single PDF.',
      'Ensure confidential legal documents stay on your machine.'
    ],
    instructions: [
      'Select multiple PDF files to merge.',
      'Drag and drop pages into your desired sequence.',
      'Click Merge PDF to compile your final file.'
    ],
    faqs: [
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'There are no artificial software limits. You can combine as many PDF files as your local memory allows.'
      }
    ],
    longContent: `Combining separate PDF files into a cohesive document is essential for professionals, students, and businesses. Our online PDF Merger handles file compilation natively inside your browser memory using PDF-Lib.`
  },
  'split-pdf': {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    category: 'pdf',
    shortDescription: 'Extract specific pages or page ranges from PDF documents instantly.',
    seoTitle: 'Split PDF Online - Extract Pages Free in Browser',
    seoDescription: 'Extract individual pages or specified page ranges (e.g. 1, 3, 5-10) from PDF documents locally without uploading.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'split pdf online free'],
    path: '/split-pdf',
    canonicalUrl: `${BASE_URL}/split-pdf`,
    iconName: 'FileText',
    features: [
      'Intelligent Range Parsing (e.g. 1, 3, 5-10)',
      'Extract Single Pages to Individual PDFs',
      'Visual Page Preview Grid',
      '100% Client-Side Processing'
    ],
    benefits: [
      'Extract only necessary chapters or invoices from large PDF manuals.',
      'Keep sensitive pages hidden by saving target selections.'
    ],
    instructions: [
      'Upload the PDF document you wish to split.',
      'Enter target page ranges or select thumbnail pages.',
      'Click Split PDF to download your extracted pages.'
    ],
    faqs: [
      {
        question: 'Can I split password-protected PDFs?',
        answer: 'Yes, as long as you provide the valid password locally to unlock page rendering.'
      }
    ],
    longContent: `Large PDF files often contain unnecessary pages. The ConvertVerse PDF Splitter provides precision page extraction capabilities using an intelligent range parser.`
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
      }
    ],
    longContent: `The ConvertVerse Image Suite gives digital creators, photographers, web developers, and designers complete control over graphic assets.`
  },
  'compress-image': {
    id: 'compress-image',
    name: 'Compress Image Online',
    category: 'image',
    shortDescription: 'Shrink JPEG, PNG, WebP, and AVIF image sizes up to 80% with lossless visual quality.',
    seoTitle: 'Compress Image Online - Reduce Photo File Size Free',
    seoDescription: 'Batch compress JPG, PNG, and WebP images locally inside your browser. Save bandwidth and improve website loading speed.',
    keywords: ['compress image', 'shrink photo size', 'reduce image MB to KB', 'batch image compressor'],
    path: '/compress-image',
    canonicalUrl: `${BASE_URL}/compress-image`,
    iconName: 'Image',
    features: [
      'Lossless & Lossy Compression Sliders',
      'Batch Image Processing Queue',
      'Real-time Side-by-Side SSIM Quality Comparison',
      '100% Browser Processing'
    ],
    benefits: [
      'Drastically reduce webpage loading times and pass Lighthouse performance audits.',
      'Save mobile data and bandwidth.'
    ],
    instructions: [
      'Upload images to compress.',
      'Adjust compression percentage or target file size.',
      'Click Compress Images to download shrunken files.'
    ],
    faqs: [
      {
        question: 'Will image compression degrade visual quality?',
        answer: 'Our adaptive compression algorithms preserve key visual features while stripping redundant image color data.'
      }
    ],
    longContent: `Optimizing photo weights is key to fast web performance. The ConvertVerse Image Compressor shrunken image payloads locally in memory.`
  },
  'resize-image': {
    id: 'resize-image',
    name: 'Resize Image (Pixels & Metric DPI)',
    category: 'image',
    shortDescription: 'Resize photos by exact pixel dimensions or physical print metrics (in, cm, mm) at 300 DPI.',
    seoTitle: 'Resize Image Online - Metric DPI & Pixel Image Resizer',
    seoDescription: 'Resize images by pixels or physical print units (inches, cm, mm) with custom DPI settings for crystal clear printing.',
    keywords: ['resize image online', 'image resizer in cm', 'resize photo inches 300 dpi', 'crop image online'],
    path: '/resize-image',
    canonicalUrl: `${BASE_URL}/resize-image`,
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
    longContent: `Sizing artwork for physical print requires converting real-world physical measurements into digital pixel allocations. Our Metric Resizer handles this calculation seamlessly.`
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
      'Prepares large email attachments under strict size caps.'
    ],
    instructions: [
      'Drag and drop any collection of files.',
      'Select compression level and click Compress All Files.'
    ],
    faqs: [
      {
        question: 'Can I compress different file types at the same time?',
        answer: 'Yes! The Universal Compressor processes mixed queues simultaneously.'
      }
    ],
    longContent: `Handling mismatched file formats is easy with our Universal Compressor workstation.`
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
      'Protects personal identity in photos before public distribution.'
    ],
    instructions: [
      'Select Encrypt File and set a secret passphrase.',
      'Download the derived `.vault` file envelope.'
    ],
    faqs: [
      {
        question: 'What happens if I lose my vault passphrase?',
        answer: 'Passphrases are never saved anywhere. Lost passphrases cannot be recovered.'
      }
    ],
    longContent: `ConvertVerse AI Secure Vault implements client-side AES-256 PBKDF2 encryption natively inside browser memory.`
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
      'Ensures attractive social sharing previews.'
    ],
    instructions: [
      'Upload your target website image or brand logo.',
      'Review audit score and copy generated HTML picture tags.'
    ],
    faqs: [
      {
        question: 'Does this tool help pass Google Lighthouse audits?',
        answer: 'Yes! It flags heavy legacy images and exports responsive HTML picture tags with loading="lazy".'
      }
    ],
    longContent: `The SEO Media Optimizer evaluates raw image weights and produces HTML5 picture code blocks.`
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
      'Batch File Processing'
    ],
    benefits: [
      'One tool for all document and data conversions.',
      'Saves time by converting files in seconds locally.'
    ],
    instructions: [
      'Upload your file.',
      'Select output format and click Convert.'
    ],
    faqs: [
      {
        question: 'Does document conversion alter original layouts?',
        answer: 'Our conversion algorithms preserve paragraph structures as closely as possible.'
      }
    ],
    longContent: `The Converter Center handles client-side format transformations between PDF, Word, TXT, HTML, and JSON.`
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
      'Export Scanned Text to TXT, PDF, or Clipboard'
    ],
    benefits: [
      'Digitize scanned receipts and book pages without privacy leaks.'
    ],
    instructions: [
      'Upload a scanned document or receipt.',
      'Click Scan Text with OCR.'
    ],
    faqs: [
      {
        question: 'How accurate is the browser OCR engine?',
        answer: 'Delivers up to 98% accuracy on clear printed documents.'
      }
    ],
    longContent: `Extracting text from scanned photos is done locally using Tesseract.js WebAssembly.`
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
      'Automated ZIP Archive Compiler'
    ],
    benefits: [
      'Automates repetitive photo and document editing tasks.'
    ],
    instructions: [
      'Add processing steps to your pipeline and click Run Batch Pipeline.'
    ],
    faqs: [
      {
        question: 'How many files can I process in a batch workflow?',
        answer: 'Process hundreds of files simultaneously in memory.'
      }
    ],
    longContent: `Construct sequential pipelines to rename, watermark, and resize images automatically.`
  },
  'about': {
    id: 'about',
    name: 'About ConvertVerse',
    category: 'legal',
    shortDescription: 'Learn about ConvertVerse zero-knowledge serverless file processing mission and architecture.',
    seoTitle: 'About ConvertVerse - 100% Local Serverless Workstation',
    seoDescription: 'Discover how ConvertVerse revolutionizes online file utilities by running 100% of PDF editing, image compression, and format conversions in your browser.',
    keywords: ['about convertverse', 'local browser converter', 'serverless file utility', 'privacy first software'],
    path: '/about',
    canonicalUrl: `${BASE_URL}/about`,
    iconName: 'Info',
    features: [
      '100% Private Client-Side Compute Model',
      'Zero Cloud Server Data Storage',
      'Modern WebAssembly & WebWorker Engines',
      'Open Source & Community Focused'
    ],
    benefits: [
      'Complete peace of mind when working with confidential files.',
      'Instant conversion speeds without network upload wait times.'
    ],
    instructions: [
      'Explore our full suite of local tools directly from the main navigation.'
    ],
    faqs: [
      {
        question: 'Why is client-side file processing safer than cloud converters?',
        answer: 'Cloud converters require uploading your files to remote third-party servers. ConvertVerse processes everything inside your browser sandbox so your files never leave your computer.'
      }
    ],
    longContent: `ConvertVerse was created to solve privacy and efficiency problems associated with online file tools.`
  },
  'privacy-policy': {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    category: 'legal',
    shortDescription: 'ConvertVerse strict privacy policy explaining 100% local processing and zero data tracking.',
    seoTitle: 'ConvertVerse Privacy Policy - 100% Private & Serverless',
    seoDescription: 'Read the ConvertVerse Privacy Policy. We store zero user files, track zero personal data, and process everything locally in your browser sandbox.',
    keywords: ['privacy policy', 'convertverse privacy', 'zero logging policy', 'data protection'],
    path: '/privacy-policy',
    canonicalUrl: `${BASE_URL}/privacy-policy`,
    iconName: 'ShieldCheck',
    features: [
      'Zero Server File Upload Policy',
      'Zero Personal Data Collection',
      'No Mandatory User Registration',
      'Client-Side Web Crypto Encryption'
    ],
    benefits: [
      'Your documents stay 100% confidential and owned by you.'
    ],
    instructions: [
      'Read our full privacy commitments below.'
    ],
    faqs: [
      {
        question: 'Do you use tracking cookies to store uploaded files?',
        answer: 'No. We do not store or transmit any uploaded files. All processing occurs temporarily in your browser RAM.'
      }
    ],
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
    features: [
      'Free Unlimited Fair-Use License',
      'No Hidden Fees or Subscription Caps',
      'Client-Side Execution Agreement'
    ],
    benefits: [
      'Use all utilities for personal or commercial projects without payment.'
    ],
    instructions: [
      'Review terms of use for personal and commercial usage.'
    ],
    faqs: [
      {
        question: 'Can I use ConvertVerse for commercial business projects?',
        answer: 'Yes! ConvertVerse is free for both personal and commercial use.'
      }
    ],
    longContent: `By using ConvertVerse, you agree to these fair-use terms of service.`
  },
  'faq': {
    id: 'faq',
    name: 'Frequently Asked Questions',
    category: 'legal',
    shortDescription: 'Answers to common questions regarding ConvertVerse file tools, privacy, and browser support.',
    seoTitle: 'ConvertVerse FAQ - Frequently Asked Questions & Answers',
    seoDescription: 'Find answers to common questions about ConvertVerse browser security, PDF editing, image compression, OCR, and browser compatibility.',
    keywords: ['convertverse faq', 'pdf converter questions', 'image compressor help'],
    path: '/faq',
    canonicalUrl: `${BASE_URL}/faq`,
    iconName: 'HelpCircle',
    features: [
      'Comprehensive Answers to Security & Privacy Questions',
      'Browser Compatibility & WebAssembly Requirements Guide',
      'File Format & Memory Limits Explanation'
    ],
    benefits: [
      'Get quick answers to all technical and usage inquiries.'
    ],
    instructions: [
      'Browse through categorized questions below or search using the navigation bar.'
    ],
    faqs: [
      {
        question: 'Which web browsers support ConvertVerse?',
        answer: 'ConvertVerse works on modern versions of Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and mobile browsers supporting WebAssembly and HTML5 Canvas.'
      },
      {
        question: 'What is the maximum file size I can process?',
        answer: 'ConvertVerse imposes zero artificial file size limits. Maximum file size depends entirely on your available physical computer RAM.'
      }
    ],
    longContent: `Welcome to the ConvertVerse Help & Frequently Asked Questions hub.`
  }
};

/**
 * Route path resolver mapping URL path (e.g. "/pdf-tools", "/merge-pdf", "/about") to tool ID
 */
export function resolveToolByPath(pathname: string): ToolMetaData {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  for (const key of Object.keys(TOOLS_REGISTRY)) {
    const tool = TOOLS_REGISTRY[key];
    if (tool.path === normalized) {
      return tool;
    }
  }

  // Route alias mappings
  if (normalized === '/pdf' || normalized === '/pdf-editor' || normalized === '/pdf-security') return TOOLS_REGISTRY['pdf'];
  if (normalized === '/image' || normalized === '/resizer' || normalized === '/compressor') return TOOLS_REGISTRY['image-tools'];
  if (normalized === '/dashboard') return TOOLS_REGISTRY['dashboard'];

  return TOOLS_REGISTRY['dashboard'];
}
