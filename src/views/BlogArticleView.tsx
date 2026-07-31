import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelmetSEOManager } from '../seo/HelmetSEOManager';
import { ArrowLeft, Calendar, Clock, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ARTICLES_DATABASE: Record<string, {
  title: string;
  snippet: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
  faqs: { question: string; answer: string }[];
}> = {
  'how-to-merge-pdf': {
    title: 'How to Merge PDF Files Online Free Without Uploading to Cloud Servers',
    snippet: 'A comprehensive step-by-step guide on combining multiple PDF documents, organizing page orders visually, and preserving vector font quality locally in your web browser.',
    category: 'PDF Tools',
    date: 'July 26, 2026',
    readTime: '8 min read',
    author: 'Adnaan Umar',
    content: `Combining separate PDF files into a single organized document is a fundamental task for businesses, legal practices, and students. However, traditional online PDF joiners force you to upload sensitive contracts and financial reports to external cloud servers, exposing your data to privacy risks.

### Why Client-Side PDF Merging Matters
When you use a standard cloud converter, your PDF files travel over public network routes to remote servers. These servers process your file and store it temporarily in remote storage buckets.

ConvertVerse eliminates this security hazard by executing 100% of PDF processing locally inside your web browser. Utilizing PDF-Lib WebAssembly binaries, ConvertVerse reads the binary object streams directly in your computer's RAM.

### Step-by-Step Guide to Merging PDFs Locally
1. **Open the Workstation:** Navigate to the [ConvertVerse PDF Merger](/pdf-tools/merge-pdf).
2. **Stage Your Files:** Drag and drop your target PDF files into the local queue.
3. **Visual Page Sorting:** Rearrange page order using the drag-and-drop thumbnail grid.
4. **Compile:** Click **Merge PDF** to assemble the output file instantly without network wait times.`,
    faqs: [
      { question: 'Is there a limit on how many PDFs I can merge?', answer: 'No artificial software limits. You can combine as many PDF files as your local device RAM permits.' },
      { question: 'Are merged PDFs watermark-free?', answer: 'Yes! All files created with ConvertVerse are 100% free and watermark-free.' }
    ]
  },
  'how-to-compress-pdf': {
    title: 'How to Compress PDF Files for Email Attachments (Lossless Local Optimization)',
    snippet: 'Learn how to shrink oversized PDF documents to under 10MB without sacrificing vector font crispness or image resolution.',
    category: 'PDF Tools',
    date: 'July 24, 2026',
    readTime: '7 min read',
    author: 'Adnaan Umar',
    content: `Large PDF files often exceed email attachment size limits (typically 25MB) or portal upload thresholds. Downscaling PDF weights requires optimizing embedded font streams and image objects.

### How PDF Compression Works
PDF files consist of vector objects, font descriptors, and bitmap graphics. The ConvertVerse PDF Compressor analyzes the object structure to compress stream streams while preserving text readability.

### Steps to Compress a PDF:
1. Access the [ConvertVerse PDF Compressor](/pdf-tools/compress-pdf).
2. Upload your document into local memory.
3. Select your target compression preset.
4. Download your shrunken PDF file.`,
    faqs: [
      { question: 'Does compressing a PDF degrade text quality?', answer: 'No. Vector fonts remain sharp regardless of image compression settings.' }
    ]
  },
  'png-vs-jpg': {
    title: 'PNG vs. JPG: Which Image Format Should You Choose for Web & Print?',
    snippet: 'An in-depth technical comparison of PNG transparency versus JPEG compression ratios, SSIM quality scores, and Web Vitals impact.',
    category: 'Image Editing',
    date: 'July 20, 2026',
    readTime: '6 min read',
    author: 'ConvertVerse Technical Review Board',
    content: `Choosing between PNG and JPEG formats depends on whether your graphic asset contains vector line art, transparency, or photo gradients.

### When to Use PNG:
- Web logos, icons, and illustrations requiring transparent backgrounds.
- High-contrast text graphics where lossy compression artifacts would blur text edges.

### When to Use JPEG:
- Photography, realistic artwork, and complex color gradients.
- Web hero images where shrinking payload size directly improves Core Web Vitals LCP.

ConvertVerse allows converting between both formats locally with our [PNG to JPG Converter](/converters/png-to-jpg) and [JPG to PNG Converter](/jpg-to-png).`,
    faqs: [
      { question: 'Can I convert PNG to JPG without losing transparency?', answer: 'JPEG does not support alpha transparency. ConvertVerse lets you pick a custom background fill color.' }
    ]
  },
  'pdf-security-guide': {
    title: 'PDF Security Guide: AES-256 Passwords, Encryption & Decryption Explained',
    snippet: 'Learn how AES-256 encryption protects sensitive PDF documents against unauthorized opening, printing, and content copying.',
    category: 'Security & Privacy',
    date: 'July 18, 2026',
    readTime: '9 min read',
    author: 'Adnaan Umar',
    content: `Protecting confidential financial statements and legal agreements requires robust encryption standard. PDF specifications support standard 128-bit and 256-bit AES encryption.

### Client-Side Encryption vs. Cloud Tools
Encrypting a PDF on a remote cloud website forces you to send your plaintext document and passphrase across the internet.

With the [ConvertVerse PDF Security Tool](/pdf-security), encryption algorithms run locally inside your browser memory. Your password and document data never leave your computer.`,
    faqs: [
      { question: 'What happens if I lose my PDF password?', answer: 'Passphrases are never saved anywhere. Lost passphrases cannot be recovered.' }
    ]
  }
};

export default function BlogArticleView() {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articleId ? ARTICLES_DATABASE[articleId] : null;

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">Article Not Found</h1>
        <p className="text-slate-300">The requested blog guide does not exist.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog Index
        </Link>
      </div>
    );
  }

  return (
    <>
      <HelmetSEOManager titleOverride={`${article.title} | ConvertVerse Blog`} descriptionOverride={article.snippet} />

      <article className="max-w-4xl mx-auto py-12 px-4 space-y-8 text-slate-300">
        <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog Index
        </Link>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="bg-emerald-500/10 text-emerald-400 font-semibold px-3 py-1 rounded-md border border-emerald-500/20">{article.category}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-emerald-400" /> {article.author}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">{article.title}</h1>
          <p className="text-lg text-slate-300 leading-relaxed border-l-4 border-emerald-500 pl-4 italic">{article.snippet}</p>
        </header>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-6 text-slate-200 leading-relaxed prose prose-invert max-w-none">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={idx} className="text-2xl font-bold text-white mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
            }
            return <p key={idx} className="leading-relaxed">{paragraph}</p>;
          })}
        </div>

        {article.faqs && article.faqs.length > 0 && (
          <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" /> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {faq.question}
                  </h4>
                  <p className="text-slate-300 text-sm pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
