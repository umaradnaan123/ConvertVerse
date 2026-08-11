import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://convert-verse-8l9l.vercel.app';
const currentDate = new Date().toISOString().split('T')[0];

const pageRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily', title: 'ConvertVerse Workstation' },
  { path: '/converters', priority: '0.9', changefreq: 'weekly', title: 'Online Unit Converters Directory' },
  { path: '/tools', priority: '0.7', changefreq: 'monthly', title: 'All Tools Directory' },
  { path: '/categories', priority: '0.7', changefreq: 'monthly', title: 'Tool Categories Index' },
  { path: '/blog', priority: '0.7', changefreq: 'monthly', title: 'Technical Blog & Guides' },
  { path: '/blog/how-to-merge-pdf', priority: '0.8', changefreq: 'monthly', title: 'How to Merge PDF Files Online Free' },
  { path: '/blog/how-to-compress-pdf', priority: '0.8', changefreq: 'monthly', title: 'How to Compress PDF Files for Email' },
  { path: '/blog/png-vs-jpg', priority: '0.8', changefreq: 'monthly', title: 'PNG vs JPG Comparison Guide' },
  { path: '/blog/pdf-security-guide', priority: '0.8', changefreq: 'monthly', title: 'PDF Encryption Security Guide' },
  { path: '/help', priority: '0.7', changefreq: 'monthly', title: 'Help & Support Center' },
  { path: '/about', priority: '0.6', changefreq: 'monthly', title: 'About ConvertVerse' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly', title: 'Contact Support' },
  { path: '/authors', priority: '0.6', changefreq: 'monthly', title: 'Authors & Engineering Team' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'monthly', title: 'Legal Disclaimer Notice' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly', title: 'Privacy Policy' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly', title: 'Terms of Service' }
];

const toolRoutes = [
  { path: '/converters/length', priority: '0.9', changefreq: 'weekly', title: 'Length Converter' },
  { path: '/converters/weight', priority: '0.9', changefreq: 'weekly', title: 'Weight & Mass Converter' },
  { path: '/converters/temperature', priority: '0.9', changefreq: 'weekly', title: 'Temperature Converter' },
  { path: '/converters/area', priority: '0.9', changefreq: 'weekly', title: 'Area Converter' },
  { path: '/converters/volume', priority: '0.9', changefreq: 'weekly', title: 'Volume Converter' },
  { path: '/converters/time', priority: '0.9', changefreq: 'weekly', title: 'Time Converter' },
  { path: '/converters/speed', priority: '0.9', changefreq: 'weekly', title: 'Speed Converter' },
  { path: '/converters/data', priority: '0.9', changefreq: 'weekly', title: 'Data Storage Converter' },
  { path: '/converters/energy', priority: '0.9', changefreq: 'weekly', title: 'Energy Converter' },
  { path: '/converters/pressure', priority: '0.9', changefreq: 'weekly', title: 'Pressure Converter' },
  { path: '/pdf-tools', priority: '0.9', changefreq: 'weekly', title: 'PDF Tools Suite' },
  { path: '/pdf-tools/merge-pdf', priority: '0.9', changefreq: 'weekly', title: 'Merge PDF Online' },
  { path: '/pdf-merge', priority: '0.9', changefreq: 'weekly', title: 'Merge PDF Online' },
  { path: '/merge-pdf', priority: '0.9', changefreq: 'weekly', title: 'Merge PDF Online' },
  { path: '/pdf-tools/split-pdf', priority: '0.9', changefreq: 'weekly', title: 'Split PDF Pages' },
  { path: '/pdf-split', priority: '0.9', changefreq: 'weekly', title: 'Split PDF Pages' },
  { path: '/split-pdf', priority: '0.9', changefreq: 'weekly', title: 'Split PDF Pages' },
  { path: '/pdf-tools/compress-pdf', priority: '0.9', changefreq: 'weekly', title: 'Compress PDF Document' },
  { path: '/pdf-compress', priority: '0.9', changefreq: 'weekly', title: 'Compress PDF Document' },
  { path: '/pdf-compressor', priority: '0.9', changefreq: 'weekly', title: 'Compress PDF Document' },
  { path: '/pdf-to-word', priority: '0.9', changefreq: 'weekly', title: 'Convert PDF to Word' },
  { path: '/word-to-pdf', priority: '0.9', changefreq: 'weekly', title: 'Convert Word to PDF' },
  { path: '/pdf-editor', priority: '0.9', changefreq: 'weekly', title: 'Visual PDF Editor' },
  { path: '/pdf-security', priority: '0.9', changefreq: 'weekly', title: 'PDF Security & Passwords' },
  { path: '/image-tools', priority: '0.9', changefreq: 'weekly', title: 'Image Tools Suite' },
  { path: '/image-tools/resize-image', priority: '0.9', changefreq: 'weekly', title: 'Metric DPI Image Resizer' },
  { path: '/resize-image', priority: '0.9', changefreq: 'weekly', title: 'Metric DPI Image Resizer' },
  { path: '/crop-image', priority: '0.9', changefreq: 'weekly', title: 'Metric DPI Image Resizer' },
  { path: '/image-tools/compress-image', priority: '0.9', changefreq: 'weekly', title: 'Compress Image Online' },
  { path: '/image-compressor', priority: '0.9', changefreq: 'weekly', title: 'Compress Image Online' },
  { path: '/image-tools/remove-background', priority: '0.9', changefreq: 'weekly', title: 'Remove Background & Censor' },
  { path: '/image-converter', priority: '0.8', changefreq: 'weekly', title: 'Universal Image Converter' },
  { path: '/converter', priority: '0.8', changefreq: 'weekly', title: 'Converter Center' },
  { path: '/converters/png-to-jpg', priority: '0.8', changefreq: 'weekly', title: 'PNG to JPG Converter' },
  { path: '/png-to-jpg', priority: '0.8', changefreq: 'weekly', title: 'PNG to JPG Converter' },
  { path: '/jpg-to-png', priority: '0.8', changefreq: 'weekly', title: 'JPG to PNG Converter' },
  { path: '/converters/webp-to-png', priority: '0.8', changefreq: 'weekly', title: 'WebP to PNG Converter' },
  { path: '/webp-to-png', priority: '0.8', changefreq: 'weekly', title: 'WebP to PNG Converter' },
  { path: '/universal-compressor', priority: '0.8', changefreq: 'weekly', title: 'Universal Compressor' },
  { path: '/file-repair', priority: '0.8', changefreq: 'weekly', title: 'File Repair Center' },
  { path: '/collaboration', priority: '0.8', changefreq: 'weekly', title: 'Real-Time Workspace' },
  { path: '/ai-content', priority: '0.8', changefreq: 'weekly', title: 'AI Content Creator Studio' },
  { path: '/secure-vault', priority: '0.8', changefreq: 'weekly', title: 'AI Secure Crypto Vault' },
  { path: '/seo-tools', priority: '0.8', changefreq: 'weekly', title: 'SEO Media Optimizer' },
  { path: '/batch-tools', priority: '0.8', changefreq: 'weekly', title: 'Batch Automation Studio' }
];

function generateXmlUrlset(items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

function generateImageUrlset(items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <image:image>
      <image:loc>${BASE_URL}/og-preview.png</image:loc>
      <image:title>${r.title}</image:title>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-tools.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-images.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}

function buildAllSitemaps() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Pages Sitemap
  fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), generateXmlUrlset(pageRoutes), 'utf-8');
  console.log('✅ sitemap-pages.xml generated with', pageRoutes.length, 'entries');

  // 2. Tools Sitemap
  fs.writeFileSync(path.join(publicDir, 'sitemap-tools.xml'), generateXmlUrlset(toolRoutes), 'utf-8');
  console.log('✅ sitemap-tools.xml generated with', toolRoutes.length, 'entries');

  // 3. Images Sitemap
  const allRoutes = [...pageRoutes, ...toolRoutes];
  fs.writeFileSync(path.join(publicDir, 'sitemap-images.xml'), generateImageUrlset(allRoutes), 'utf-8');
  console.log('✅ sitemap-images.xml generated with', allRoutes.length, 'image entries');

  // 4. Sitemap Index (sitemap.xml)
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemapIndex(), 'utf-8');
  console.log('✅ sitemap.xml Index generated successfully referencing 3 sub-sitemaps!');

  // 5. Robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /private/
Disallow: /temp/
Disallow: /api/
Disallow: /*.vault$

Crawl-delay: 1

Sitemap: ${BASE_URL}/sitemap.xml
Host: ${BASE_URL}
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✅ robots.txt generated successfully!');
}

buildAllSitemaps();
