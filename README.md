# ConvertVerse 🚀

**ConvertVerse** is a private, client-side browser utility workstation designed to process PDF documents, compress image files, perform OCR text scanning, format code assets, and execute cryptographic file operations natively inside the browser—with zero server uploads.

![ConvertVerse License](https://img.shields.io/badge/License-MIT-emerald.svg)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Core Web Vitals](https://img.shields.io/badge/Lighthouse-100%2F100-violet.svg)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA-cyan.svg)

---

## 🌟 Key Features

### 📄 PDF Toolbox & Visual Editor
- **Visual PDF Merger:** Drag and drop PDF files to combine them with visual page previews.
- **Intelligent Page Splitter:** Parse custom range strings (e.g. `1, 3, 5-10`) to split large documents instantly.
- **Vector Page Numbering:** Stamp crisp, scale-independent page numbers with customizable positions and color palettes.
- **Layout Rotation:** Fix orientation for inverted document scans.

### 🖼️ Image Suite & Metric Print Resizer
- **Physical Metric DPI Resizer:** Calculate print-to-pixel resolution using physical units (`in`, `cm`, `mm`) and target DPI (`72` to `600 DPI`).
- **Batch Compression:** Shrink JPEG, PNG, WebP, and AVIF image payloads while preserving structural image quality (SSIM).
- **Apple HEIC Converter:** Decode native iOS HEIC/HEIF photos directly into standard JPEGs locally.
- **EXIF Metadata Scrubber:** Remove camera tags, GPS coordinates, and device timestamps to protect personal privacy.

### 🔒 AI Secure Vault & Privacy Shield
- **AES-256 PBKDF2 Local Crypto Vault:** Encrypt raw file buffers inside 256-bit AES containers using 100,000 PBKDF2 key iterations.
- **Face & Region Privacy Blur:** Apply adjustable quadrant center blurs to hide faces or confidential text.
- **Timed Self-Destruct Sharing:** Create temporary browser ObjectURLs bound to auto-revoking countdown timers.

### 🤖 AI Document Toolkit & SEO Optimizer
- **Client-Side Tesseract.js OCR:** Extract text from scanned photos and receipts locally without third-party API fees.
- **Core Web Vitals Auditor:** Measure image weights, evaluate LCP impact, and auto-generate responsive HTML `<picture>` code blocks with lazy loading.
- **Favicon Package Compiler:** Crop and export 16x16, 32x32, and 180x180 (Apple Touch Icon) PNG packages in a single ZIP.

---

## 🔒 Security Architecture

ConvertVerse is built on a **Zero-Knowledge Client-Side Architecture**:
1. **Zero Cloud File Transmission:** All file processing (PDF rendering, image manipulation, cryptographic transformations) runs in local browser memory via WebAssembly and WebWorkers.
2. **Hardened HTTP Headers:** Configured via `vercel.json` with strict `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and `Strict-Transport-Security`.
3. **Local Encryption:** Files encrypted via the Web Crypto API use salt-strengthened PBKDF2 keys.

---

## ⚡ Performance Optimization

- **Code Splitting & Dynamic Imports:** Every tool view is loaded lazily using `React.lazy` and `Suspense`, maintaining an initial entry JavaScript bundle of < 150KB.
- **Manual Vendor Chunking:** Libraries (`pdf-lib`, `jspdf`, `pdfjs-dist`, `tesseract.js`, `framer-motion`) are split into isolated vendor chunks.
- **Terser Minification:** Production builds strip all `console.log` statements and dead code.
- **Resource Hints & PWA Pre-caching:** Critical assets are cached offline via a custom Service Worker (`public/sw.js`).

---

## 🎯 Technical SEO & Discovery

- **Dynamic Head & JSON-LD Syncing:** Automatic injection of unique Titles (50-60 chars), Meta Descriptions (140-160 chars), Canonical tags, Open Graph cards, Twitter Cards, and Schema.org JSON-LD definitions (`WebSite`, `Organization`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`).
- **Search Engine Sitemaps:** Automated generation of valid `sitemap.xml` and crawlable `robots.txt`.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation & Local Development

```bash
# 1. Clone repository
git clone https://github.com/umaradnaan123/ConvertVerse.git
cd ConvertVerse

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Production build
npm run build
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.