import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://convert-verse-8l9l.vercel.app';
const currentDate = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily', image: `${BASE_URL}/og-preview.png`, title: 'ConvertVerse Workstation' },
  { path: '/dashboard', priority: '1.0', changefreq: 'daily', image: `${BASE_URL}/og-preview.png`, title: 'Workstation Dashboard' },
  { path: '/pdf-tools', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'PDF Tools Suite' },
  { path: '/pdf-tools/merge-pdf', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Merge PDF Online' },
  { path: '/pdf-merge', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Merge PDF Online' },
  { path: '/pdf-tools/split-pdf', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Split PDF Pages' },
  { path: '/pdf-split', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Split PDF Pages' },
  { path: '/pdf-tools/compress-pdf', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Compress PDF Document' },
  { path: '/pdf-compress', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Compress PDF Document' },
  { path: '/pdf-to-word', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Convert PDF to Word' },
  { path: '/word-to-pdf', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Convert Word to PDF' },
  { path: '/pdf-editor', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Visual PDF Editor' },
  { path: '/pdf-security', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'PDF Security & Passwords' },
  { path: '/image-tools', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Image Tools Suite' },
  { path: '/image-tools/resize-image', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Metric DPI Image Resizer' },
  { path: '/image-tools/compress-image', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Compress Image Online' },
  { path: '/image-tools/remove-background', priority: '0.9', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Remove Background & Censor' },
  { path: '/image-converter', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Universal Image Converter' },
  { path: '/converter', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Converter Center' },
  { path: '/converters/png-to-jpg', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'PNG to JPG Converter' },
  { path: '/png-to-jpg', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'PNG to JPG Converter' },
  { path: '/jpg-to-png', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'JPG to PNG Converter' },
  { path: '/converters/webp-to-png', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'WebP to PNG Converter' },
  { path: '/webp-to-png', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'WebP to PNG Converter' },
  { path: '/universal-compressor', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Universal Compressor' },
  { path: '/file-repair', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'File Repair Center' },
  { path: '/collaboration', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Real-Time Workspace' },
  { path: '/ai-content', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'AI Content Creator Studio' },
  { path: '/secure-vault', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'AI Secure Crypto Vault' },
  { path: '/seo-tools', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'SEO Media Optimizer' },
  { path: '/batch-tools', priority: '0.8', changefreq: 'weekly', image: `${BASE_URL}/og-preview.png`, title: 'Batch Automation Studio' },
  { path: '/tools', priority: '0.7', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'All Tools Directory' },
  { path: '/categories', priority: '0.7', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Tool Categories Index' },
  { path: '/search', priority: '0.7', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Tool Search Workstation' },
  { path: '/blog', priority: '0.7', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Technical Blog & Guides' },
  { path: '/blog/how-to-merge-pdf', priority: '0.8', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'How to Merge PDF Files Online Free' },
  { path: '/blog/how-to-compress-pdf', priority: '0.8', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'How to Compress PDF Files for Email' },
  { path: '/blog/png-vs-jpg', priority: '0.8', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'PNG vs JPG Comparison Guide' },
  { path: '/blog/pdf-security-guide', priority: '0.8', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'PDF Encryption Security Guide' },
  { path: '/help', priority: '0.7', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Help & Support Center' },
  { path: '/about', priority: '0.6', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'About ConvertVerse' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Contact Support' },
  { path: '/authors', priority: '0.6', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Authors & Engineering Team' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Legal Disclaimer Notice' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Privacy Policy' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly', image: `${BASE_URL}/og-preview.png`, title: 'Terms of Service' }
];

function generateSitemap() {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <image:image>
      <image:loc>${r.image}</image:loc>
      <image:title>${r.title}</image:title>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('✅ public/sitemap.xml generated successfully with', routes.length, 'clean canonical URLs and Google Image Sitemap elements!');
}

function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow private/admin routes
Disallow: /admin/
Disallow: /private/
Disallow: /temp/
Disallow: /api/
Disallow: /*.vault$

Crawl-delay: 1

Sitemap: ${BASE_URL}/sitemap.xml
`;

  const publicDir = path.resolve(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✅ public/robots.txt generated successfully!');
}

generateSitemap();
generateRobotsTxt();
