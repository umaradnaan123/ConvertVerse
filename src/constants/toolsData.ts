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
    features: ['100% Serverless & Private Processing', 'Instant Batch Operations', 'Drag & Drop Multi-file Queue'],
    benefits: ['Files stay on your physical device', 'Instant conversion using WebAssembly'],
    instructions: ['Select any utility tool.', 'Drag and drop your files into local queue.', 'Download instant results.'],
    faqs: [{ question: 'Are files uploaded?', answer: 'No. Operations run 100% client-side.' }],
    longContent: 'ConvertVerse is an offline-first browser workstation.'
  },
  'pdf-tools': {
    id: 'pdf-tools',
    name: 'PDF Tools Workstation',
    category: 'pdf',
    shortDescription: 'Merge, split, extract pages, rotate, and compress PDF documents.',
    seoTitle: 'Free Online PDF Merger, Splitter & Compressor | ConvertVerse',
    seoDescription: 'Merge PDF files, split pages using custom ranges, rotate layouts, and compress PDFs in seconds. 100% local browser processing.',
    keywords: ['merge pdf online', 'split pdf free', 'pdf compressor', 'rotate pdf pages'],
    path: '/pdf-tools',
    canonicalUrl: `${BASE_URL}/pdf-tools`,
    iconName: 'FileText',
    badge: 'Essential',
    features: ['Visual Page Drag Reordering', 'Range Splitting', 'Vector Page Numbering'],
    benefits: ['Confidential legal documents stay local.'],
    instructions: ['Upload PDF files.', 'Choose merge, split, or compress.', 'Download final PDF.'],
    faqs: [{ question: 'Is page reordering supported?', answer: 'Yes, drag and drop thumbnails.' }],
    longContent: 'Complete PDF document management directly in browser memory.'
  },
  'pdf-merge': {
    id: 'pdf-merge',
    name: 'Merge PDF Online',
    category: 'pdf',
    shortDescription: 'Combine multiple PDF files into one single organized document visually.',
    seoTitle: 'Merge PDF Files Online - Free Client-Side PDF Joiner',
    seoDescription: 'Combine multiple PDF documents into one single file visually in your browser. Rearrange pages, preview layouts, and merge PDFs locally.',
    keywords: ['merge pdf', 'combine pdf files', 'pdf joiner online', 'merge pdf free'],
    path: '/pdf-merge',
    canonicalUrl: `${BASE_URL}/pdf-merge`,
    iconName: 'FileText',
    features: ['Visual Grid Page Reordering', 'Multi-File PDF Combination', 'Zero Cloud Upload Data Security'],
    benefits: ['Consolidate report files or contracts into a single PDF.'],
    instructions: ['Select multiple PDF files.', 'Drag pages into sequence.', 'Click Merge PDF.'],
    faqs: [{ question: 'Is there a limit on PDFs merged?', answer: 'No artificial software limits.' }],
    longContent: 'Combine separate PDF files natively inside browser memory.'
  },
  'pdf-split': {
    id: 'pdf-split',
    name: 'Split PDF Pages',
    category: 'pdf',
    shortDescription: 'Extract specific pages or page ranges from PDF documents instantly.',
    seoTitle: 'Split PDF Online - Extract Pages Free in Browser',
    seoDescription: 'Extract individual pages or specified page ranges (e.g. 1, 3, 5-10) from PDF documents locally without uploading.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'split pdf free'],
    path: '/pdf-split',
    canonicalUrl: `${BASE_URL}/pdf-split`,
    iconName: 'FileText',
    features: ['Range Parsing (e.g. 1, 3, 5-10)', 'Single Page Extraction', 'Visual Grid Preview'],
    benefits: ['Extract chapters or invoices from large PDFs.'],
    instructions: ['Upload PDF document.', 'Enter page ranges.', 'Click Split PDF.'],
    faqs: [{ question: 'Can I split password protected PDFs?', answer: 'Yes, after supplying password locally.' }],
    longContent: 'Extract targeted pages with precision page range parsing.'
  },
  'pdf-compress': {
    id: 'pdf-compress',
    name: 'Compress PDF Document',
    category: 'pdf',
    shortDescription: 'Shrink PDF file size locally while preserving vector text crispness.',
    seoTitle: 'Compress PDF Online - Reduce PDF File Size Free',
    seoDescription: 'Reduce PDF file size locally in browser memory. Ideal for email attachments and portal submissions.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf file', 'pdf compressor'],
    path: '/pdf-compress',
    canonicalUrl: `${BASE_URL}/pdf-compress`,
    iconName: 'Minimize2',
    features: ['Vector Stream Optimization', 'Lossless Text Compression', 'Instant Size Savings'],
    benefits: ['Prepare heavy documents under email limits.'],
    instructions: ['Upload PDF.', 'Select compression level.', 'Download shrunken PDF.'],
    faqs: [{ question: 'Is text readable after compression?', answer: 'Yes, vector fonts remain sharp.' }],
    longContent: 'Optimizes PDF buffer sizes natively inside browser RAM.'
  },
  'pdf-to-word': {
    id: 'pdf-to-word',
    name: 'Convert PDF to Word / Text',
    category: 'pdf',
    shortDescription: 'Extract text and structured content from PDF files into Word or Text documents.',
    seoTitle: 'Convert PDF to Word Online - Free Client-Side Text Extractor',
    seoDescription: 'Convert PDF documents into editable Word or Text files locally using client-side text parsing.',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to text converter', 'extract text from pdf'],
    path: '/pdf-to-word',
    canonicalUrl: `${BASE_URL}/pdf-to-word`,
    iconName: 'RefreshCw',
    features: ['Text & Structure Parsing', 'Export to TXT & Doc Format', '100% Local Privacy'],
    benefits: ['Edit PDF content in word processing applications.'],
    instructions: ['Upload PDF file.', 'Click Convert to Word/Text.', 'Download file.'],
    faqs: [{ question: 'Is document privacy maintained?', answer: 'Yes, text extraction happens 100% locally.' }],
    longContent: 'Extract clean text streams from PDF files.'
  },
  'word-to-pdf': {
    id: 'word-to-pdf',
    name: 'Convert Word to PDF',
    category: 'pdf',
    shortDescription: 'Convert Word documents (DOCX, TXT, HTML) into standard PDF files.',
    seoTitle: 'Convert Word to PDF Online - Free & Local',
    seoDescription: 'Convert Word files (DOCX, TXT) into PDF format directly in your browser with complete privacy.',
    keywords: ['word to pdf', 'convert docx to pdf', 'txt to pdf converter'],
    path: '/word-to-pdf',
    canonicalUrl: `${BASE_URL}/word-to-pdf`,
    iconName: 'RefreshCw',
    features: ['HTML/Text to PDF Vector Render', 'Standard Layout Compilation', 'Offline Processing'],
    benefits: ['Lock formatting by saving documents as PDF.'],
    instructions: ['Upload Word file.', 'Click Convert to PDF.', 'Download PDF.'],
    faqs: [{ question: 'Can I convert text files to PDF?', answer: 'Yes, TXT and DOCX files are supported.' }],
    longContent: 'Compile documents into clean vector PDF files.'
  },
  'image-tools': {
    id: 'image-tools',
    name: 'Image Suite',
    category: 'image',
    shortDescription: 'Compress JPEGs/PNGs, resize by DPI metrics, convert HEIC, and scrub EXIF data.',
    seoTitle: 'Online Image Resizer, Compressor & HEIC Converter | ConvertVerse',
    seoDescription: 'Batch compress image files, resize with physical metric DPI controls (in/cm/mm), decode Apple HEIC photos, and scrub EXIF data locally.',
    keywords: ['image compressor online', 'online image resizer', 'HEIC to JPG converter'],
    path: '/image-tools',
    canonicalUrl: `${BASE_URL}/image-tools`,
    iconName: 'Image',
    features: ['Metric DPI Physical Print Resizer', 'HEIC to JPEG Decoder', 'EXIF Scrubbing'],
    benefits: ['Optimizes Web Vitals and image load speeds.'],
    instructions: ['Upload images.', 'Choose operation.', 'Download processed files.'],
    faqs: [{ question: 'How does metric resizer work?', answer: 'Translates physical inches/cm to pixels via DPI.' }],
    longContent: 'Complete client-side graphic asset manipulation.'
  },
  'image-tools-resize': {
    id: 'image-tools-resize',
    name: 'Resize Image Workstation',
    category: 'image',
    shortDescription: 'Resize image dimensions in pixels or physical print units with metric DPI controls.',
    seoTitle: 'Resize Image Online - Metric DPI Image Resizer | ConvertVerse',
    seoDescription: 'Resize JPEG, PNG, and WebP images by exact pixel dimensions or physical print metric units (inches, cm, mm) with custom DPI controls.',
    keywords: ['resize image', 'image resizer online', 'change image dimensions'],
    path: '/image-tools/resize-image',
    canonicalUrl: `${BASE_URL}/image-tools/resize-image`,
    iconName: 'Image',
    features: ['Pixel & Metric DPI Resizing', 'Aspect Ratio Lock', 'Batch Image Resizing'],
    benefits: ['Prepare images for social media covers, banners, or physical printing.'],
    instructions: ['Upload image file.', 'Set width, height, or DPI.', 'Download resized image.'],
    faqs: [{ question: 'Can I lock aspect ratio?', answer: 'Yes, toggle aspect ratio locking on or off.' }],
    longContent: 'Resize image files locally with physical DPI calculations.'
  },
  'image-tools-compress': {
    id: 'image-tools-compress',
    name: 'Compress Image Workstation',
    category: 'image',
    shortDescription: 'Reduce photo file size locally while keeping high visual quality.',
    seoTitle: 'Compress Image Online - Free Photo Size Reducer | ConvertVerse',
    seoDescription: 'Batch compress JPG, PNG, and WebP images locally inside browser memory. Reduce file size up to 80% without cloud uploads.',
    keywords: ['compress image', 'reduce image size', 'photo size reducer'],
    path: '/image-tools/compress-image',
    canonicalUrl: `${BASE_URL}/image-tools/compress-image`,
    iconName: 'Image',
    features: ['Lossless & Lossy Compression Sliders', 'Batch Processing', 'Quality Preview'],
    benefits: ['Improve site loading speed and lower network bandwidth.'],
    instructions: ['Upload images.', 'Adjust quality slider.', 'Download shrunken files.'],
    faqs: [{ question: 'Are files kept private?', answer: 'Yes, all compression occurs in local RAM.' }],
    longContent: 'Compress images for faster Web Vitals performance.'
  },
  'image-tools-remove-bg': {
    id: 'image-tools-remove-bg',
    name: 'Remove Background & Censor Workstation',
    category: 'image',
    shortDescription: 'Scrub metadata, censor sensitive regions, and blur image backgrounds locally.',
    seoTitle: 'Remove Background & Censor Photo Online | ConvertVerse',
    seoDescription: 'Scrub photo EXIF tags, censor face quadrants, and blur image regions locally inside browser memory.',
    keywords: ['remove background', 'censor photo', 'scrub EXIF metadata'],
    path: '/image-tools/remove-background',
    canonicalUrl: `${BASE_URL}/image-tools/remove-background`,
    iconName: 'Image',
    features: ['EXIF Metadata Scrubber', 'Facial Quadrant Blur Censor', 'Local Canvas Render'],
    benefits: ['Protect privacy before posting photos online.'],
    instructions: ['Upload image.', 'Select region or scrub metadata.', 'Export clean photo.'],
    faqs: [{ question: 'Does EXIF scrubbing remove GPS tags?', answer: 'Yes, all EXIF headers and GPS tags are stripped.' }],
    longContent: 'Privacy scrubbing and visual censoring directly in your browser.'
  },
  'image-compressor': {
    id: 'image-compressor',
    name: 'Image Compressor Workstation',
    category: 'image',
    shortDescription: 'Shrink JPEG, PNG, WebP, and AVIF photo weights up to 80% locally.',
    seoTitle: 'Image Compressor Online - Reduce Photo File Size Free | ConvertVerse',
    seoDescription: 'Batch compress JPG, PNG, and WebP images locally inside browser memory. Save bandwidth and improve page speeds.',
    keywords: ['image compressor', 'shrink photo size', 'reduce image MB to KB'],
    path: '/image-compressor',
    canonicalUrl: `${BASE_URL}/image-compressor`,
    iconName: 'Image',
    features: ['Lossless & Lossy Sliders', 'Batch Processing', 'SSIM Comparison'],
    benefits: ['Reduce loading times to pass Lighthouse audits.'],
    instructions: ['Upload photos.', 'Adjust compression.', 'Download.'],
    faqs: [{ question: 'Is quality preserved?', answer: 'Yes, adaptive compression preserves visual detail.' }],
    longContent: 'Optimize image weights for fast page load performance.'
  },
  'image-converter': {
    id: 'image-converter',
    name: 'Universal Image Converter',
    category: 'converter',
    shortDescription: 'Convert between PNG, JPEG, WebP, AVIF, HEIC, and BMP graphic formats.',
    seoTitle: 'Universal Image Converter | PNG, JPG, WebP, HEIC, AVIF | ConvertVerse',
    seoDescription: 'Convert image files locally between PNG, JPEG, WebP, AVIF, and HEIC formats with 100% browser privacy.',
    keywords: ['image converter', 'png to jpg', 'webp to png', 'heic to jpeg converter'],
    path: '/image-converter',
    canonicalUrl: `${BASE_URL}/image-converter`,
    iconName: 'RefreshCw',
    features: ['Multi-Format Image Batch Decoder', 'HEIC to JPEG Converter', 'Quality Controls'],
    benefits: ['Convert photos into web-ready formats.'],
    instructions: ['Upload images.', 'Select target format and convert.'],
    faqs: [{ question: 'Can I convert HEIC photos?', answer: 'Yes, Apple HEIC photos convert locally to JPEG.' }],
    longContent: 'Convert graphic assets across web image formats.'
  },
  'png-to-jpg': {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'converter',
    shortDescription: 'Convert heavy transparent PNG graphics to lightweight JPEG images.',
    seoTitle: 'PNG to JPG Converter Online - Free & Private | ConvertVerse',
    seoDescription: 'Convert PNG images to JPEG format with customizable background fill color and compression controls.',
    keywords: ['png to jpg', 'convert png to jpeg', 'png2jpg free'],
    path: '/png-to-jpg',
    canonicalUrl: `${BASE_URL}/png-to-jpg`,
    iconName: 'RefreshCw',
    features: ['PNG to JPG Conversion', 'Background Color Picker', 'Batch Processing'],
    benefits: ['Reduce file sizes by converting uncompressed PNGs into JPEGs.'],
    instructions: ['Select PNG files.', 'Click Convert to JPG.'],
    faqs: [{ question: 'What happens to transparency?', answer: 'Transparency fills with white or selected background color.' }],
    longContent: 'Convert PNG graphics to JPEG format for smaller web image payloads.'
  },
  'jpg-to-png': {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'converter',
    shortDescription: 'Convert JPEG photos into PNG format with full alpha channel support.',
    seoTitle: 'JPG to PNG Converter Online - Free & Local | ConvertVerse',
    seoDescription: 'Convert JPG images to PNG format locally in browser memory with zero loss in visual quality.',
    keywords: ['jpg to png', 'convert jpeg to png', 'jpg2png free'],
    path: '/jpg-to-png',
    canonicalUrl: `${BASE_URL}/jpg-to-png`,
    iconName: 'RefreshCw',
    features: ['Lossless JPG to PNG Export', 'Batch Conversion', 'Local Canvas Render'],
    benefits: ['Convert JPEGs into uncompressed PNG graphics.'],
    instructions: ['Select JPG files.', 'Click Convert to PNG.'],
    faqs: [{ question: 'Is conversion lossless?', answer: 'Yes, JPEG pixels are saved as lossless PNG.' }],
    longContent: 'Convert JPEG photos into standard PNG graphics.'
  },
  'webp-to-png': {
    id: 'webp-to-png',
    name: 'WebP to PNG Converter',
    category: 'converter',
    shortDescription: 'Convert modern WebP images into full quality PNG graphics.',
    seoTitle: 'WebP to PNG Converter Online - Preserve Transparency | ConvertVerse',
    seoDescription: 'Convert WebP images to PNG format instantly while preserving full alpha channel transparency.',
    keywords: ['webp to png', 'convert webp to png', 'webp2png free'],
    path: '/webp-to-png',
    canonicalUrl: `${BASE_URL}/webp-to-png`,
    iconName: 'RefreshCw',
    features: ['Alpha Transparency Support', 'Lossless PNG Export', 'Instant Browser Rendering'],
    benefits: ['Use WebP images in design apps requiring PNG files.'],
    instructions: ['Select WebP files.', 'Click Convert to PNG.'],
    faqs: [{ question: 'Is transparency preserved?', answer: 'Yes, alpha channels remain intact.' }],
    longContent: 'Decode WebP images back into standard PNG assets.'
  },
  'pdf-editor': {
    id: 'pdf-editor',
    name: 'Visual PDF Page Editor',
    category: 'pdf',
    shortDescription: 'Rotate, reorder, delete, and visual grid editor for PDF pages.',
    seoTitle: 'Free Visual PDF Page Editor - Reorder & Rotate PDF Pages | ConvertVerse',
    seoDescription: 'Edit PDF layouts visually in your browser. Reorder pages, rotate page orientation, and delete unwanted pages.',
    keywords: ['pdf editor online', 'rotate pdf pages', 'reorder pdf pages'],
    path: '/pdf-editor',
    canonicalUrl: `${BASE_URL}/pdf-editor`,
    iconName: 'FileText',
    features: ['Visual Drag Grid Layout', 'Page Rotation', 'Delete Page Selections'],
    benefits: ['Fix upside-down scanned documents without heavy software.'],
    instructions: ['Upload PDF.', 'Drag thumbnails or click rotate.', 'Export PDF.'],
    faqs: [{ question: 'Can I rotate individual pages?', answer: 'Yes, each page thumbnail has independent controls.' }],
    longContent: 'Visual PDF page editing directly in your browser.'
  },
  'pdf-security': {
    id: 'pdf-security',
    name: 'PDF Security & Protection',
    category: 'security',
    shortDescription: 'Encrypt PDF documents with passwords or unlock protected PDFs locally.',
    seoTitle: 'PDF Password Security - Encrypt & Unlock PDF Online | ConvertVerse',
    seoDescription: 'Protect PDF documents with passwords or unlock password-protected PDFs locally with complete confidentiality.',
    keywords: ['protect pdf password', 'encrypt pdf online', 'unlock pdf file'],
    path: '/pdf-security',
    canonicalUrl: `${BASE_URL}/pdf-security`,
    iconName: 'ShieldCheck',
    features: ['256-bit AES Encryption', 'Custom User/Master Passwords', 'Local Decryption'],
    benefits: ['Prevent unauthorized reading of financial and legal PDFs.'],
    instructions: ['Select Encrypt or Unlock.', 'Upload PDF.', 'Set password.'],
    faqs: [{ question: 'Are passwords stored?', answer: 'Never. Encryption occurs locally.' }],
    longContent: 'Secure confidential documents with local PDF security tools.'
  },
  'disclaimer': {
    id: 'disclaimer',
    name: 'Disclaimer & Legal Notice',
    category: 'legal',
    shortDescription: 'ConvertVerse legal disclaimers regarding local browser compute and liability.',
    seoTitle: 'Disclaimer & Legal Notice | ConvertVerse Workstation',
    seoDescription: 'Read the official ConvertVerse legal disclaimer regarding client-side processing, file ownership, and liability boundaries.',
    keywords: ['convertverse disclaimer', 'legal notice', 'client side processing liability'],
    path: '/disclaimer',
    canonicalUrl: `${BASE_URL}/disclaimer`,
    iconName: 'Info',
    features: ['Zero Server Storage Commitment', 'Browser Computational Disclaimer', 'Fair Use Terms'],
    benefits: ['Understand software operation terms and data boundaries.'],
    instructions: ['Review legal disclaimers below.'],
    faqs: [{ question: 'Does ConvertVerse back up my converted files?', answer: 'No, all files exist only in your browser memory.' }],
    longContent: 'Legal disclaimer governing the use of ConvertVerse.'
  },
  'authors': {
    id: 'authors',
    name: 'Authors & Engineering Team',
    category: 'legal',
    shortDescription: 'Meet the software architects, security auditors, and performance engineers behind ConvertVerse.',
    seoTitle: 'Authors & Engineering Team | ConvertVerse EEAT Trust',
    seoDescription: 'Learn about the full-stack software architects, technical SEO experts, and security auditors building ConvertVerse.',
    keywords: ['convertverse authors', 'convertverse developers', 'eeat trust authors'],
    path: '/authors',
    canonicalUrl: `${BASE_URL}/authors`,
    iconName: 'Info',
    features: ['Expert Software Architect Profiles', 'Security & Cryptographic Credentials', 'Core Web Vitals Engineering Team'],
    benefits: ['Transparent authorship and EEAT trust verification.'],
    instructions: ['Read our engineering profiles.'],
    faqs: [{ question: 'Who maintains ConvertVerse?', answer: 'Maintained by full-stack performance engineers.' }],
    longContent: 'Meet the team building high-performance browser tools.'
  }
};

export function resolveToolByPath(pathname: string): ToolMetaData {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  // Direct exact path match in TOOLS_REGISTRY
  for (const key of Object.keys(TOOLS_REGISTRY)) {
    const tool = TOOLS_REGISTRY[key];
    if (tool.path === normalized) {
      return tool;
    }
  }

  // Fallback defaults while preserving normalized path for self-referencing canonicals
  if (normalized === '/' || normalized === '/dashboard') return TOOLS_REGISTRY['dashboard'];
  
  if (normalized.startsWith('/pdf')) {
    return { ...TOOLS_REGISTRY['pdf-tools'], path: normalized, canonicalUrl: `${BASE_URL}${normalized}` };
  }
  if (normalized.startsWith('/image')) {
    return { ...TOOLS_REGISTRY['image-tools'], path: normalized, canonicalUrl: `${BASE_URL}${normalized}` };
  }
  if (normalized.startsWith('/converters') || normalized.startsWith('/png') || normalized.startsWith('/jpg') || normalized.startsWith('/webp')) {
    return { ...TOOLS_REGISTRY['image-converter'], path: normalized, canonicalUrl: `${BASE_URL}${normalized}` };
  }

  return { ...TOOLS_REGISTRY['dashboard'], path: normalized, canonicalUrl: `${BASE_URL}${normalized}` };
}
