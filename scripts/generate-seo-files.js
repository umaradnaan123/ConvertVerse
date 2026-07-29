import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://convert-verse-8l9l.vercel.app';
const currentDate = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/dashboard', priority: '1.0', changefreq: 'daily' },
  { path: '/pdf-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/pdf-tools/merge-pdf', priority: '0.9', changefreq: 'weekly' },
  { path: '/pdf-tools/split-pdf', priority: '0.9', changefreq: 'weekly' },
  { path: '/pdf-tools/compress-pdf', priority: '0.9', changefreq: 'weekly' },
  { path: '/pdf-editor', priority: '0.9', changefreq: 'weekly' },
  { path: '/pdf-security', priority: '0.9', changefreq: 'weekly' },
  { path: '/image-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/image-tools/resize-image', priority: '0.9', changefreq: 'weekly' },
  { path: '/image-tools/compress-image', priority: '0.9', changefreq: 'weekly' },
  { path: '/image-tools/remove-background', priority: '0.9', changefreq: 'weekly' },
  { path: '/image-converter', priority: '0.8', changefreq: 'weekly' },
  { path: '/converter', priority: '0.8', changefreq: 'weekly' },
  { path: '/converters/png-to-jpg', priority: '0.8', changefreq: 'weekly' },
  { path: '/converters/webp-to-png', priority: '0.8', changefreq: 'weekly' },
  { path: '/universal-compressor', priority: '0.8', changefreq: 'weekly' },
  { path: '/file-repair', priority: '0.8', changefreq: 'weekly' },
  { path: '/collaboration', priority: '0.8', changefreq: 'weekly' },
  { path: '/ai-content', priority: '0.8', changefreq: 'weekly' },
  { path: '/secure-vault', priority: '0.8', changefreq: 'weekly' },
  { path: '/seo-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/batch-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools', priority: '0.7', changefreq: 'monthly' },
  { path: '/categories', priority: '0.7', changefreq: 'monthly' },
  { path: '/search', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'monthly' },
  { path: '/help', priority: '0.7', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly' }
];

function generateSitemap() {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
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
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('✅ public/sitemap.xml generated successfully with', routes.length, 'clean canonical URLs!');
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
