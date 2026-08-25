import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'convert-verse-8l9l.vercel.app';
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = '45c0839e99214b60a80e15904d98342a';

async function submitIndexNow() {
  const publicDir = path.resolve(__dirname, '../public');
  const sitemapPagesPath = path.join(publicDir, 'sitemap-pages.xml');
  const sitemapToolsPath = path.join(publicDir, 'sitemap-tools.xml');
  const sitemapBlogPath = path.join(publicDir, 'sitemap-blog.xml');

  const urlList = [];

  [sitemapPagesPath, sitemapToolsPath, sitemapBlogPath].forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(/<loc>(.*?)<\/loc>/g) || [];
      matches.forEach(m => {
        const u = m.replace('<loc>', '').replace('</loc>', '');
        if (u && !urlList.includes(u)) {
          urlList.push(u);
        }
      });
    }
  });

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urlList
  };

  console.log(`📡 IndexNow Submission Payload: ${urlList.length} URLs to Bing / Yandex / Seznam...`);

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`✅ IndexNow Response Status: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error('⚠️ IndexNow ping completed (offline or network fallback):', err.message);
  }
}

submitIndexNow();
