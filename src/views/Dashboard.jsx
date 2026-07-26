import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, Shrink, FileText, FileSpreadsheet, Presentation, Table, Images, Image,
  RotateCw, Stamp, PenTool, Unlock, Lock, Layers, Wrench, Scan, Columns, Camera,
  Hash, Edit3, Archive, Scissors, Search, ShieldCheck, Zap, 
  HelpCircle, ChevronDown, MessageSquare, Star, Database, Smile, Sparkles, EyeOff,
  FileCode, Users
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import HistoryList from '../components/HistoryList';

export default function Dashboard({ setCurrentView, setCurrentSubTab, history, setHistory }) {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('allCategories') },
    { id: 'popular', label: t('popularCat') },
    { id: 'nextGen', label: 'Next-Gen SaaS' },
    { id: 'toPdf', label: t('toPdfCat') },
    { id: 'fromPdf', label: t('fromPdfCat') },
    { id: 'editSign', label: t('editSignCat') },
    { id: 'security', label: t('securityCat') },
    { id: 'pages', label: t('pagesCat') },
    { id: 'imageOptimize', label: 'Optimize' },
    { id: 'imageCreate', label: 'Create' },
    { id: 'imageModify', label: 'Modify' },
    { id: 'imageConvert', label: 'Convert' },
    { id: 'imageSecurity', label: 'Security' }
  ];

  const allTools = [
    // 1. Popular
    {
      id: 'merge-pdf',
      title: t('mergeTitle'),
      desc: t('mergeSub'),
      icon: Layers,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Popular',
      shadow: 'shadow-glow-accent',
      category: 'popular',
      view: 'pdf',
      subTab: 'merge'
    },
    {
      id: 'split-pdf',
      title: t('splitTitle'),
      desc: t('splitSub'),
      icon: Scissors,
      color: 'from-violet-500 to-indigo-500',
      badge: 'Popular',
      shadow: 'shadow-glow-primary',
      category: 'popular',
      view: 'pdf',
      subTab: 'split'
    },
    {
      id: 'word-to-pdf',
      title: t('wordToPdfTitle'),
      desc: t('wordToPdfSub'),
      icon: FileSpreadsheet,
      color: 'from-blue-500 to-indigo-500',
      badge: 'Popular',
      shadow: 'shadow-glow-secondary',
      category: 'popular',
      view: 'converter',
      subTab: 'word-pdf'
    },
    {
      id: 'sign-pdf',
      title: t('signTitle'),
      desc: t('signSub'),
      icon: PenTool,
      color: 'from-fuchsia-500 to-pink-500',
      badge: 'Popular',
      shadow: 'shadow-glow-primary',
      category: 'popular',
      view: 'pdf-editor',
      subTab: 'sign'
    },
    {
      id: 'universal-compressor',
      title: 'Universal Compressor',
      desc: 'Compress JPG, PNG, WEBP, PDF, DOCX, ZIP, MP3, MP4 locally in-browser to a target size.',
      icon: Shrink,
      color: 'from-amber-500 to-orange-500',
      badge: 'Advanced',
      shadow: 'shadow-glow-secondary',
      category: 'popular',
      view: 'universal-compressor'
    },
    {
      id: 'ai-smart-optimizer',
      title: 'AI Smart File Optimizer',
      desc: 'Audit page-speed loads, target ALT tags, remove duplicates, and enhance visual contrast client-side.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      badge: 'AI Smart',
      shadow: 'shadow-glow-primary',
      category: 'popular',
      view: 'ai-smart-optimizer'
    },
    {
      id: 'cloudless-file-studio',
      title: 'Cloudless File Studio',
      desc: 'Manage ZIP archives, checkpoint version rollbacks, and configure global hotkeys directly in-browser.',
      icon: ShieldCheck,
      color: 'from-teal-500 to-emerald-500',
      badge: 'Cloud Studio',
      shadow: 'shadow-glow-accent',
      category: 'popular',
      view: 'cloudless-file-studio'
    },
    {
      id: 'ai-document-toolkit',
      title: 'AI Doc & Media Toolkit',
      desc: 'Transcribe mic speech-to-text, snapshot screens to PDF, and crop audio PCM timelines.',
      icon: Zap,
      color: 'from-amber-500 to-rose-500',
      badge: 'Next-Gen',
      shadow: 'shadow-glow-secondary',
      category: 'popular',
      view: 'ai-document-toolkit'
    },
    {
      id: 'file-repair-recovery',
      title: 'AI File Repair & Recovery',
      desc: 'Scan byte arrays to auto-repair corrupted PDFs, damaged ZIP archives, broken image headers, and media metadata locally.',
      icon: Wrench,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Binary AI',
      shadow: 'shadow-glow-primary',
      category: 'nextGen',
      view: 'file-repair-recovery'
    },
    {
      id: 'collaboration-workspace',
      title: 'Collab Workspace',
      desc: 'Work on shared folders, draw on annotation boards, comment locally, and sync using simulated P2P networks.',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      badge: 'P2P Sync',
      shadow: 'shadow-glow-accent',
      category: 'nextGen',
      view: 'collaboration-workspace'
    },
    {
      id: 'ai-content-creator',
      title: 'AI Content Studio',
      desc: 'Design beautiful social headers, mock screens, generate clean QR codes, and export premium graphic visual assets.',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500',
      badge: 'AI Creator',
      shadow: 'shadow-glow-primary',
      category: 'nextGen',
      view: 'ai-content-creator'
    },
    {
      id: 'ai-secure-vault',
      title: 'AI Secure Vault',
      desc: 'Encrypt files to secure AES vaults, scrub EXIF metadata tags, blur faces, and create timed self-destruct shares.',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Security',
      shadow: 'shadow-glow-secondary',
      category: 'nextGen',
      view: 'ai-secure-vault'
    },
    {
      id: 'seo-media-optimizer',
      title: 'SEO Media Optimizer',
      desc: 'Generate responsive mobile/tablet/desktop WebP bundles, create app favicons, and design social Open Graph cards instantly.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      badge: 'SEO Audit',
      shadow: 'shadow-glow-primary',
      category: 'nextGen',
      view: 'seo-media-optimizer'
    },
    {
      id: 'batch-automation',
      title: 'Batch Automation',
      desc: 'Process hundreds of staging files simultaneously. Build custom pipelines to rename, watermark, and compress zip stacks.',
      icon: Layers,
      color: 'from-emerald-500 to-green-600',
      badge: 'Automation',
      shadow: 'shadow-glow-accent',
      category: 'nextGen',
      view: 'batch-automation'
    },
    // 2. Convert to PDF
    {
      id: 'excel-to-pdf',
      title: t('excelToPdfTitle'),
      desc: t('excelToPdfSub'),
      icon: Table,
      color: 'from-green-500 to-emerald-500',
      badge: 'Sheet Parser',
      shadow: 'shadow-glow-accent',
      category: 'toPdf',
      view: 'converter',
      subTab: 'excel-pdf'
    },
    {
      id: 'ppt-to-pdf',
      title: t('pptToPdfTitle'),
      desc: t('pptToPdfSub'),
      icon: Presentation,
      color: 'from-orange-500 to-red-500',
      badge: 'Slide Compiler',
      shadow: 'shadow-glow-secondary',
      category: 'toPdf',
      view: 'converter',
      subTab: 'ppt-pdf'
    },
    {
      id: 'jpg-to-pdf',
      title: t('jpgToPdfTitle'),
      desc: t('jpgToPdfSub'),
      icon: Image,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Canvas PDF',
      shadow: 'shadow-glow-secondary',
      category: 'toPdf',
      view: 'converter',
      subTab: 'images-pdf'
    },
    // 3. Convert from PDF
    {
      id: 'pdf-to-word',
      title: t('pdfToWordTitle'),
      desc: t('pdfToWordSub'),
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      badge: 'AI OCR Parser',
      shadow: 'shadow-glow-secondary',
      category: 'fromPdf',
      view: 'converter',
      subTab: 'pdf-word'
    },
    {
      id: 'pdf-to-ppt',
      title: t('pdfToPptTitle'),
      desc: t('pdfToPptSub'),
      icon: Presentation,
      color: 'from-rose-500 to-pink-500',
      badge: 'Zipped Slides',
      shadow: 'shadow-glow-primary',
      category: 'fromPdf',
      view: 'converter',
      subTab: 'pdf-ppt'
    },
    {
      id: 'pdf-to-excel',
      title: t('pdfToExcelTitle'),
      desc: t('pdfToExcelSub'),
      icon: Table,
      color: 'from-emerald-500 to-green-500',
      badge: 'Table Grids',
      shadow: 'shadow-glow-accent',
      category: 'fromPdf',
      view: 'converter',
      subTab: 'pdf-excel'
    },
    {
      id: 'pdf-to-jpg',
      title: t('pdfToJpgTitle'),
      desc: t('pdfToJpgSub'),
      icon: Images,
      color: 'from-fuchsia-500 to-purple-500',
      badge: 'Batch Images',
      shadow: 'shadow-glow-primary',
      category: 'fromPdf',
      view: 'converter',
      subTab: 'pdf-jpg'
    },
    // 4. Edit & Sign
    {
      id: 'edit-pdf',
      title: t('editTitle'),
      desc: t('editSub'),
      icon: Edit3,
      color: 'from-indigo-500 to-violet-500',
      badge: 'Visual Layer',
      shadow: 'shadow-glow-primary',
      category: 'editSign',
      view: 'pdf-editor',
      subTab: 'edit'
    },
    {
      id: 'watermark-pdf',
      title: t('watermarkTitle'),
      desc: t('watermarkSub'),
      icon: Stamp,
      color: 'from-pink-500 to-rose-500',
      badge: 'Transparency',
      shadow: 'shadow-glow-secondary',
      category: 'editSign',
      view: 'pdf-editor',
      subTab: 'watermark'
    },
    {
      id: 'ocr-pdf',
      title: t('ocrTitle'),
      desc: t('ocrSub'),
      icon: Scan,
      color: 'from-sky-500 to-indigo-500',
      badge: 'Tesseract OCR',
      shadow: 'shadow-glow-primary',
      category: 'editSign',
      view: 'pdf-editor',
      subTab: 'ocr'
    },
    {
      id: 'compare-pdf',
      title: t('compareTitle'),
      desc: t('compareSub'),
      icon: Columns,
      color: 'from-amber-500 to-orange-500',
      badge: 'Pixel Contrast',
      shadow: 'shadow-glow-secondary',
      category: 'editSign',
      view: 'pdf-editor',
      subTab: 'compare'
    },
    // 5. PDF Security
    {
      id: 'protect-pdf',
      title: t('protectTitle'),
      desc: t('protectSub'),
      icon: Lock,
      color: 'from-red-500 to-rose-600',
      badge: 'AES-256 Crypto',
      shadow: 'shadow-glow-secondary',
      category: 'security',
      view: 'pdf-security',
      subTab: 'protect'
    },
    {
      id: 'unlock-pdf',
      title: t('unlockTitle'),
      desc: t('unlockSub'),
      icon: Unlock,
      color: 'from-lime-500 to-green-600',
      badge: 'Local Decrypt',
      shadow: 'shadow-glow-accent',
      category: 'security',
      view: 'pdf-security',
      subTab: 'unlock'
    },
    {
      id: 'repair-pdf',
      title: t('repairTitle'),
      desc: t('repairSub'),
      icon: Wrench,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Headers Rebuilt',
      shadow: 'shadow-glow-primary',
      category: 'security',
      view: 'pdf-security',
      subTab: 'repair'
    },
    {
      id: 'pdf-to-pdfa',
      title: t('pdfaTitle'),
      desc: t('pdfaSub'),
      icon: Archive,
      color: 'from-purple-500 to-indigo-500',
      badge: 'Visual Flatten',
      shadow: 'shadow-glow-primary',
      category: 'security',
      view: 'pdf-security',
      subTab: 'pdfa'
    },
    // 6. Page Management & Image Tools
    {
      id: 'rotate-pdf',
      title: t('rotateTitle'),
      desc: t('rotateSub'),
      icon: RotateCw,
      color: 'from-amber-500 to-yellow-500',
      badge: '90° / 180°',
      shadow: 'shadow-glow-secondary',
      category: 'pages',
      view: 'pdf',
      subTab: 'rotate'
    },
    {
      id: 'organize-pdf',
      title: t('organizeTitle'),
      desc: t('organizeSub'),
      icon: Layers,
      color: 'from-cyan-500 to-teal-500',
      badge: 'Visual Organize',
      shadow: 'shadow-glow-accent',
      category: 'pages',
      view: 'pdf',
      subTab: 'organize'
    },
    {
      id: 'scan-pdf',
      title: t('scanTitle'),
      desc: t('scanSub'),
      icon: Camera,
      color: 'from-emerald-500 to-green-500',
      badge: 'Camera Capture',
      shadow: 'shadow-glow-accent',
      category: 'pages',
      view: 'pdf',
      subTab: 'scan'
    },
    {
      id: 'numbering-pdf',
      title: t('numberingTitle'),
      desc: t('numberingSub'),
      icon: Hash,
      color: 'from-fuchsia-500 to-pink-500',
      badge: 'Page Numbers',
      shadow: 'shadow-glow-primary',
      category: 'pages',
      view: 'pdf',
      subTab: 'numbering'
    },
    {
      id: 'compress-pdf',
      title: t('compressTitle'),
      desc: t('compressSub'),
      icon: Shrink,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Optimize Size',
      shadow: 'shadow-glow-secondary',
      category: 'pages',
      view: 'pdf',
      subTab: 'compress'
    },
    {
      id: 'resizer',
      title: t('resizerTitle'),
      desc: t('resizerSub'),
      icon: Scale,
      color: 'from-violet-500 to-indigo-500',
      badge: 'Advanced Units',
      shadow: 'shadow-glow-primary',
      category: 'imageOptimize',
      view: 'image-tools',
      subTab: 'resize'
    },
    {
      id: 'compressor',
      title: t('compressorTitle'),
      desc: t('compressorSub'),
      icon: Shrink,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Batch Queue',
      shadow: 'shadow-glow-secondary',
      category: 'imageOptimize',
      view: 'image-tools',
      subTab: 'compress'
    },
    {
      id: 'compress-img',
      title: 'Compress Image',
      desc: 'Lossless compression engine with adjustable quality and Max MB filters.',
      icon: Shrink,
      color: 'from-emerald-400 to-teal-500',
      badge: 'Optimize',
      shadow: 'shadow-glow-accent',
      category: 'imageOptimize',
      view: 'image-tools',
      subTab: 'compress'
    },
    {
      id: 'resize-img',
      title: 'Resize Image',
      desc: 'Scale images using Pixel dimensions, Percentage scale, Inches, or Centimeters.',
      icon: Scale,
      color: 'from-violet-400 to-indigo-500',
      badge: 'Optimize',
      shadow: 'shadow-glow-primary',
      category: 'imageOptimize',
      view: 'image-tools',
      subTab: 'resize'
    },
    {
      id: 'crop-img',
      title: 'Crop Image',
      desc: 'Visual crop frames for Instagram square, cinematic 16:9, or custom bounds.',
      icon: Scissors,
      color: 'from-fuchsia-400 to-pink-500',
      badge: 'Modify',
      shadow: 'shadow-glow-primary',
      category: 'imageModify',
      view: 'image-tools',
      subTab: 'crop'
    },
    {
      id: 'rotate-img',
      title: 'Rotate Image',
      desc: 'Multi-degree visual rotators with mirror flipping horizontally or vertically.',
      icon: RotateCw,
      color: 'from-orange-400 to-amber-500',
      badge: 'Modify',
      shadow: 'shadow-glow-secondary',
      category: 'imageModify',
      view: 'image-tools',
      subTab: 'rotate'
    },
    {
      id: 'to-jpg',
      title: 'Convert to JPG',
      desc: 'Instantly convert PNG, WEBP, HEIC, BMP pictures to standard JPG layers.',
      icon: Image,
      color: 'from-blue-400 to-cyan-500',
      badge: 'Convert',
      shadow: 'shadow-glow-secondary',
      category: 'imageConvert',
      view: 'image-tools',
      subTab: 'to-jpg'
    },
    {
      id: 'from-jpg',
      title: 'Convert from JPG',
      desc: 'Batch render standard JPG images to PNG, WEBP, raw BMP, or flat PDF booklets.',
      icon: Images,
      color: 'from-purple-400 to-indigo-500',
      badge: 'Convert',
      shadow: 'shadow-glow-primary',
      category: 'imageConvert',
      view: 'image-tools',
      subTab: 'from-jpg'
    },
    {
      id: 'html-to-img',
      title: 'HTML to Image',
      desc: 'Interactive live HTML/CSS template compiler outputs custom print-ready files.',
      icon: FileCode,
      color: 'from-sky-400 to-indigo-500',
      badge: 'Create',
      shadow: 'shadow-glow-primary',
      category: 'imageCreate',
      view: 'image-tools',
      subTab: 'html-to-img'
    },
    {
      id: 'upscale-img',
      title: 'Upscale Image',
      desc: 'Super-resolution bicubic pixel interpolator magnifying frames (2x, 4x) cleanly.',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      badge: 'Optimize',
      shadow: 'shadow-glow-secondary',
      category: 'imageOptimize',
      view: 'image-tools',
      subTab: 'upscale'
    },
    {
      id: 'remove-bg',
      title: 'Remove Background',
      desc: 'Chroma-key magic-wand that clears borders and custom backgrounds instantly.',
      icon: Sparkles,
      color: 'from-cyan-400 to-emerald-500',
      badge: 'Modify',
      shadow: 'shadow-glow-accent',
      category: 'imageModify',
      view: 'image-tools',
      subTab: 'remove-bg'
    },
    {
      id: 'meme-gen',
      title: 'Meme Generator',
      desc: 'Stamp top and bottom captions with Impact shadows, custom fonts, and colors.',
      icon: Smile,
      color: 'from-rose-400 to-pink-500',
      badge: 'Create',
      shadow: 'shadow-glow-primary',
      category: 'imageCreate',
      view: 'image-tools',
      subTab: 'meme'
    },
    {
      id: 'photo-editor',
      title: 'Photo Editor',
      desc: 'Complete studio drawing kit with Grayscale, Sepia, Blur, shape layers, and brush.',
      icon: Edit3,
      color: 'from-indigo-400 to-violet-500',
      badge: 'Modify',
      shadow: 'shadow-glow-primary',
      category: 'imageModify',
      view: 'image-tools',
      subTab: 'editor'
    },
    {
      id: 'watermark-img',
      title: 'Watermark Image',
      desc: 'Protect custom photography with opacity-controlled vector text overlays.',
      icon: Stamp,
      color: 'from-pink-400 to-rose-500',
      badge: 'Security',
      shadow: 'shadow-glow-secondary',
      category: 'imageSecurity',
      view: 'image-tools',
      subTab: 'watermark'
    },
    {
      id: 'blur-face',
      title: 'Blur Face / Censorship',
      desc: 'Draw visual box-blur bubbles to censor faces and private metrics locally.',
      icon: EyeOff,
      color: 'from-red-400 to-rose-600',
      badge: 'Security',
      shadow: 'shadow-glow-secondary',
      category: 'imageSecurity',
      view: 'image-tools',
      subTab: 'blur'
    }
  ];

  const formats = [
    { name: 'JPG / JPEG', type: 'Image', status: 'In-Browser' },
    { name: 'PNG', type: 'Image', status: 'In-Browser' },
    { name: 'WEBP', type: 'Image', status: 'In-Browser' },
    { name: 'HEIC', type: 'Apple Raw', status: 'In-Browser' },
    { name: 'SVG / BMP', type: 'Vector / Raw', status: 'In-Browser' },
    { name: 'PDF', type: 'Document', status: 'In-Browser' },
    { name: 'DOCX / WORD', type: 'Office Document', status: 'In-Browser' }
  ];

  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') }
  ];

  const testimonials = [
    { text: t('testimonial1Text'), user: t('testimonial1User'), rating: 5 },
    { text: t('testimonial2Text'), user: t('testimonial2User'), rating: 5 }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleToolClick = (tool) => {
    if (setCurrentSubTab) {
      setCurrentSubTab(tool.subTab);
    }
    setCurrentView(tool.view || tool.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Spatial Search & Category Filters
  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                            tool.category === activeCategory || 
                            (activeCategory === 'popular' && tool.badge === 'Popular');
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const nextGenTools = allTools.filter(tool => tool.category === 'nextGen');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-16 py-4"
    >
      {/* 1. Futuristic Hero Banner */}
      <motion.section 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-white/5 dark:border-white/5 light:border-black/5 bg-gradient-to-br from-dark-950 via-dark-900/80 to-dark-950 dark:from-dark-950 light:from-white px-6 py-12 md:p-16 text-center space-y-6 shadow-2xl"
      >
        {/* Glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary-500/10 dark:bg-secondary-500/10 light:bg-secondary-500/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 text-xs font-semibold text-primary-400 dark:text-primary-400 light:text-primary-600 mb-2 font-mono">
            <Sparkles size={12} className="animate-pulse" />
            <span>Introducing Next-Gen AI Workspace</span>
          </div>
          
          <h1 className="text-fluid-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans leading-tight text-white dark:text-white light:text-dark-950">
            The Decentralized, Local-First
            <span className="block mt-2 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
              AI Document & SaaS Studio
            </span>
          </h1>
          
          <p className="text-fluid-sm md:text-base text-dark-400 dark:text-dark-400 light:text-dark-600 max-w-2xl mx-auto leading-relaxed">
            Run complex PDF enhancements, batch workflows, collaborative whiteboards, and military-grade EXIF metadata scrubbers directly in your browser memory. 100% private, 100% secure.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-3 pt-4 text-xs font-mono text-dark-300 dark:text-dark-300 light:text-dark-700">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-primary" />
              100% In-Browser Memory (WASM)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-secondary" />
              Zero Server Trackers
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-glow-primary" />
              AES-256 Client Encryption
            </span>
          </div>
        </div>
      </motion.section>

      {/* Clickable Sponsored Network Promo Bar */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-secondary-500/20 dark:border-secondary-500/20 light:border-secondary-500/10 bg-gradient-to-r from-secondary-950/30 via-primary-950/20 to-accent-950/30 dark:from-secondary-950/30 light:from-secondary-50/50 p-6 shadow-glass hover:shadow-glow-secondary transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center text-secondary-400 flex-shrink-0">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="block text-sm font-bold text-white dark:text-white light:text-dark-950">
              Need High-Speed Cloud Workloads?
            </span>
            <span className="block text-xs text-dark-400 dark:text-dark-400 light:text-dark-600">
              Access high-performance distributed cloud clusters and scale your business processing instantly.
            </span>
          </div>
        </div>
        <a 
          href="https://www.effectivecpmnetwork.com/r1w8jwtc?key=d90e40c314b49478cb2f5496e9288c01"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-secondary-500 to-primary-500 text-xs font-bold text-white shadow-glow-secondary hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
            Explore Premium Network
          </button>
        </a>
      </motion.div>

      {/* 2. Premium Next-Gen AI SaaS Suite Showcase */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-fluid-2xl sm:text-fluid-3xl font-bold tracking-tight text-white dark:text-white light:text-dark-950 flex items-center gap-2">
            <Sparkles className="text-secondary-400 animate-pulse" size={24} />
            Next-Gen AI SaaS Suite
          </h2>
          <p className="text-fluid-sm text-dark-400 dark:text-dark-400 light:text-dark-600">
            Advanced client-side intelligence modules. Speed up workflow pipelines, encrypt files, and restore assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nextGenTools.map((tool) => {
            const Icon = tool.icon;
            const featuresMap = {
              'file-repair-recovery': ['Header Fix', 'Corrupted ZIP', 'Byte Scan', 'Local WASM'],
              'collaboration-workspace': ['Shared Folders', 'Live Drawing', 'Comments', 'Simulated P2P'],
              'ai-content-creator': ['Social Headers', 'Mockups', 'QR Engine', 'Graphic Assets'],
              'ai-secure-vault': ['AES-256 Crypto', 'EXIF Scrubber', 'Face Censor', 'Timed Shares'],
              'seo-media-optimizer': ['WebP Bundles', 'Favicon Generator', 'Open Graph Card', 'Responsive'],
              'batch-automation': ['Staging Queues', 'Pipelines', 'Auto Watermark', 'Batch ZIP']
            };
            const features = featuresMap[tool.id] || [];

            return (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                onClick={() => handleToolClick(tool)}
                className={`glass-panel border border-white/5 dark:border-white/5 light:border-black/5 rounded-3xl p-6 shadow-glass hover:${tool.shadow} hover:border-white/10 dark:hover:border-white/10 light:hover:border-black/10 active:scale-98 cursor-pointer group flex flex-col justify-between h-[320px] transition-all relative overflow-hidden`}
              >
                {/* Background soft glow on card hover */}
                <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300 pointer-events-none`} />

                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5 text-dark-300 dark:text-dark-300 light:text-dark-700 font-mono px-2.5 py-1 rounded-full font-bold">
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="font-extrabold text-base text-dark-100 dark:text-dark-100 light:text-dark-900 group-hover:text-primary-400 transition-colors duration-300">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-dark-400 dark:text-dark-400 light:text-dark-600 leading-relaxed mt-1.5 line-clamp-3">
                      {tool.desc}
                    </p>
                  </div>

                  {/* Features Tag List */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {features.map((feat, idx) => (
                      <span key={idx} className="text-[9px] font-semibold bg-white/5 dark:bg-white/5 light:bg-black/5 text-dark-400 dark:text-dark-400 light:text-dark-600 px-2 py-0.5 rounded-md font-mono">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Launch Link */}
                <div className="pt-4 border-t border-white/5 dark:border-white/5 light:border-black/5 flex items-center justify-between">
                  <span className="text-[10px] text-dark-500 dark:text-dark-500 light:text-dark-600 uppercase font-bold tracking-wider font-mono">
                    Local App • Active
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-primary-400 dark:text-primary-400 light:text-primary-600 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Launch Workspace</span>
                    <span className="text-sm font-normal">→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Filterable SaaS Tools Hub */}
      <section id="tools" className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 dark:border-b-white/5 light:border-b-black/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-fluid-2xl sm:text-fluid-3xl font-bold tracking-tight text-white dark:text-white light:text-dark-950 flex items-center gap-2">
              <Database className="text-primary-400" size={24} />
              All-In-One Document Suite
            </h2>
            <p className="text-fluid-sm text-dark-400 dark:text-dark-400 light:text-dark-600">Select from 26 advanced browser-based utilities. 100% free and cloud-optimized.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-96 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-400 light:text-dark-600" size={17} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none text-dark-100 dark:text-dark-100 light:text-dark-900 hover:border-primary-500/40 focus:border-primary-500 transition-all shadow-glass"
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4.5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-primary-500/15 border-primary-500/25 text-primary-400 dark:text-primary-400 light:text-primary-600 shadow-glow-primary'
                  : 'bg-white/5 dark:bg-white/5 light:bg-black/5 border-transparent text-dark-400 dark:text-dark-400 light:text-dark-600 hover:text-dark-200 dark:hover:text-dark-200 light:hover:text-dark-800 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 26-Tool Dynamic Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                onClick={() => handleToolClick(tool)}
                className={`glass-panel border border-white/5 dark:border-white/5 light:border-black/5 rounded-2xl p-4.5 shadow-glass hover:${tool.shadow} cursor-pointer group flex flex-col justify-between min-h-[160px] hover:border-white/10 dark:hover:border-white/10 light:hover:border-black/10 active:scale-98 transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-all shadow-md`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5 text-dark-300 dark:text-dark-300 light:text-dark-700 font-mono px-2 py-0.5 rounded-full font-bold">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-dark-100 dark:text-dark-100 light:text-dark-900 group-hover:text-primary-400 transition-colors mt-3">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-dark-400 dark:text-dark-400 light:text-dark-600 leading-relaxed mt-1.5 truncate-3-lines">
                    {tool.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Local Conversion History & Formats Split */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Local History Card */}
        <div className="lg:col-span-2">
          <HistoryList history={history} setHistory={setHistory} />
        </div>

        {/* Live Formats Support Matrix */}
        <div className="glass-panel rounded-3xl p-6 shadow-glass relative overflow-hidden space-y-4">
          <div>
            <h3 className="font-bold text-lg text-dark-100 dark:text-dark-100 light:text-dark-900 flex items-center gap-2">
              <Database size={18} className="text-secondary-400" />
              Supported Formats
            </h3>
            <p className="text-xs text-dark-400 dark:text-dark-400 light:text-dark-600">Supported formats operating locally in WebAssembly</p>
          </div>
          
          <div className="divide-y divide-white/5 dark:divide-white/5 light:divide-black/5 overflow-y-auto max-h-[295px] pr-1.5">
            {formats.map((fmt, index) => (
              <div key={index} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-dark-200 dark:text-dark-200 light:text-dark-800 font-mono">{fmt.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-400 dark:text-dark-400 light:text-dark-600 text-[10px]">{fmt.type}</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md font-mono text-[9px]">
                    {fmt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Rich Keyword Optimized SEO Section */}
      <section className="glass-panel p-8 rounded-3xl border border-white/5 dark:border-white/5 light:border-black/5 relative overflow-hidden shadow-glass">
        <div className="absolute top-0 right-0 glow-orb-2 scale-75 opacity-10" />
        <div className="max-w-3xl space-y-5 relative z-10">
          <h2 className="text-2xl font-bold tracking-tight text-white dark:text-white light:text-dark-950">High-Speed Image Resizing & Lossless PDF Optimization</h2>
          <p className="text-sm text-dark-400 dark:text-dark-400 light:text-dark-600 leading-relaxed text-justify">
            ConvertVerse is engineered to perform as a premium **Image Compressor Online** and high-speed **Online Image Resizer** that executes operations within your own browser engine. By utilizing hardware-accelerated compiling threads, you can resize digital imagery using precise **Pixels**, physical **Inches**, **Centimeters**, **Millimeters**, or fluid **Percentages** while preserving exact aspect ratios.
          </p>
          <p className="text-sm text-dark-400 dark:text-dark-400 light:text-dark-600 leading-relaxed text-justify">
            Our platform operates as a robust, client-first **Free PDF Compressor** and comprehensive **Image to PDF Converter**. Rather than routing your private data grids through external third-party servers, ConvertVerse manipulates vectors and pages using raw local client-side memory blocks. Easily convert documents (like JPG to PNG, WEBP, and document scanners) with absolute zero tracking or subscription boundaries!
          </p>
        </div>
      </section>

      {/* Clickable Sponsored AD Banner */}
      <motion.a 
        href="https://www.effectivecpmnetwork.com/y64k0hg8e?key=b6e031570e1ac4dcce264194b1bf0101"
        target="_blank"
        rel="noopener noreferrer"
        variants={itemVariants}
        className="block relative overflow-hidden rounded-3xl border border-primary-500/20 dark:border-primary-500/20 light:border-primary-500/10 bg-gradient-to-r from-primary-950/40 via-secondary-950/30 to-accent-950/40 dark:from-primary-950/40 light:from-primary-50/50 p-6 md:p-8 shadow-glass hover:shadow-glow-primary transition-all duration-300 group cursor-pointer"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        {/* Decorative background glow elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 rounded-full bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-500/5 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 rounded-full bg-secondary-500/10 dark:bg-secondary-500/10 light:bg-secondary-500/5 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/15 border border-primary-500/20 text-[10px] font-bold text-primary-400 dark:text-primary-400 light:text-primary-650 uppercase tracking-widest font-mono">
              <Sparkles size={10} className="animate-pulse" />
              <span>Sponsored Offer</span>
            </div>
            <h3 className="text-fluid-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white dark:text-white light:text-dark-950">
              Accelerate Your Business Workflows With Premium Cloud Architecture
            </h3>
            <p className="text-xs sm:text-sm text-dark-400 dark:text-dark-400 light:text-dark-655 leading-relaxed">
              Explore high-performance processing networks, dedicated cloud servers, and advanced enterprise automation pipelines designed for modern scalability.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto text-center">
            <div className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_auto] text-sm font-bold text-white shadow-glow-primary hover:bg-right transition-all duration-500 flex items-center justify-center gap-2 group-hover:shadow-glow-secondary">
              <span>Explore Network</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
      </motion.a>

      {/* 6. Accordion FAQs */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-fluid-2xl sm:text-fluid-3xl font-bold tracking-tight text-white dark:text-white light:text-dark-950 flex items-center justify-center gap-2">
            <HelpCircle className="text-primary-400" />
            {t('faqTitle')}
          </h2>
          <p className="text-fluid-sm text-dark-400 dark:text-dark-400 light:text-dark-600">Everything you need to know about browser-based file utilities</p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="glass-panel rounded-2xl border border-white/5 dark:border-white/5 light:border-black/5 transition-all shadow-glass"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-semibold text-dark-100 dark:text-dark-100 light:text-dark-900 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown size={18} className={`text-dark-400 dark:text-dark-400 light:text-dark-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-400 dark:text-primary-400 light:text-primary-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-dark-400 dark:text-dark-400 light:text-dark-600 leading-relaxed border-t border-white/5 dark:border-t-white/5 light:border-t-black/5 animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Reviews Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-fluid-2xl sm:text-fluid-3xl font-bold tracking-tight text-white dark:text-white light:text-dark-950 flex items-center justify-center gap-2">
            <MessageSquare className="text-secondary-400" />
            {t('testimonialsTitle')}
          </h2>
          <p className="text-fluid-sm text-dark-400 dark:text-dark-400 light:text-dark-600">Used by creators, developers, and designers around the globe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((test, index) => (
            <div key={index} className="glass-panel p-6 rounded-3xl shadow-glass flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="flex gap-1 mb-2">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-dark-300 dark:text-dark-300 light:text-dark-700 italic leading-relaxed">
                "{test.text}"
              </p>
              <div className="flex items-center gap-2 border-t border-white/5 dark:border-t-white/5 light:border-t-black/5 pt-4">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-xs">
                  {test.user[0]}
                </div>
                <span className="text-xs font-bold text-dark-100 dark:text-dark-100 light:text-dark-900">{test.user}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
