import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function swAssetInjector() {
  return {
    name: 'sw-asset-injector',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const swPath = path.resolve(distDir, 'sw.js');

      if (!fs.existsSync(swPath)) {
        console.warn('[swAssetInjector] sw.js not found in dist, skipping asset injection.');
        return;
      }

      const getFiles = (dir: string): string[] => {
        let results: string[] = [];
        if (!fs.existsSync(dir)) return results;
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const filePath = path.resolve(dir, file);
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath));
          } else {
            const relPath = path.relative(distDir, filePath).replace(/\\/g, '/');
            results.push('./' + relPath);
          }
        });
        return results;
      };

      let assets: string[] = [];
      const assetsDir = path.resolve(distDir, 'assets');
      if (fs.existsSync(assetsDir)) {
        assets = getFiles(assetsDir);
      }

      const standardShell = [
        './',
        './index.html',
        './favicon.svg',
        './manifest.json',
        './sitemap.xml',
        './robots.txt'
      ];

      const allPrecache = [...standardShell, ...assets];

      let swContent = fs.readFileSync(swPath, 'utf8');
      const precacheRegex = /const\s+PRECACHE_ASSETS\s*=\s*\[[\s\S]*?\];/;
      const precacheString = `const PRECACHE_ASSETS = ${JSON.stringify(allPrecache, null, 2)};`;
      swContent = swContent.replace(precacheRegex, precacheString);

      const cacheNameRegex = /const\s+CACHE_NAME\s*=\s*['"`][\s\S]*?['"`];/;
      const cacheNameString = `const CACHE_NAME = 'convertverse-v-${Date.now()}';`;
      swContent = swContent.replace(cacheNameRegex, cacheNameString);

      fs.writeFileSync(swPath, swContent, 'utf8');
      console.log(`[swAssetInjector] Injected ${allPrecache.length} assets and updated cache version in sw.js`);
    }
  };
}

export default defineConfig({
  plugins: [react(), swAssetInjector()],
  base: './',
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(Date.now())
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
            if (id.includes('pdf-lib')) return 'vendor-pdflib';
            if (id.includes('jspdf')) return 'vendor-jspdf';
            if (id.includes('tesseract.js')) return 'vendor-tesseract';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('heic2any')) return 'vendor-heic2any';
            if (id.includes('mammoth')) return 'vendor-mammoth';
            if (id.includes('jszip')) return 'vendor-jszip';
            if (id.includes('lucide-react')) return 'vendor-icons';
          }
        }
      }
    }
  }
});
