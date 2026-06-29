// IndexNow ping — notifies Bing/Yandex/Naver of fresh URLs.
// Usage:
//   node scripts/indexnow.mjs            # ping all URLs
//   node scripts/indexnow.mjs /json-formatter /base64   # ping subset
//
// One call covers Bing + Yandex + Naver + Seznam; they share the index.
// Free, no auth beyond a key file at https://<host>/<key>.txt.

import fs from 'node:fs';
import path from 'node:path';

const HOST = 'inbrowser.sh';
const KEY = 'a1b2c3d4e5f60718293a4b5c6d7e8f90'; // must match public/<KEY>.txt + src/lib/seo.ts
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function readAllUrls() {
  const dist = path.resolve('dist');
  const indexPath = path.join(dist, 'sitemap-index.xml');
  const fallbackPath = path.join(dist, 'sitemap-0.xml');

  if (!fs.existsSync(indexPath) && fs.existsSync(fallbackPath)) {
    const sitemap = fs.readFileSync(fallbackPath, 'utf8');
    return Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
  }

  if (!fs.existsSync(indexPath)) {
    throw new Error('Missing dist/sitemap-index.xml. Run npm run build first.');
  }

  const index = fs.readFileSync(indexPath, 'utf8');
  const sitemapUrls = Array.from(index.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
  const urls = new Set();

  for (const sitemapUrl of sitemapUrls) {
    const filename = new URL(sitemapUrl).pathname.split('/').pop();
    if (!filename) continue;
    const sitemapPath = path.join(dist, filename);
    if (!fs.existsSync(sitemapPath)) continue;
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(match[1]);
  }

  return Array.from(urls);
}

const argv = process.argv.slice(2);
const urls = argv.length > 0
  ? argv.map(p => p.startsWith('http') ? p : `https://${HOST}${p.startsWith('/') ? p : '/' + p}`)
  : readAllUrls();

if (urls.length === 0) {
  console.error('No URLs to submit. Build dist/ first or pass paths as args.');
  process.exit(1);
}

console.log(`IndexNow → submitting ${urls.length} URLs to ${HOST}`);

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };

const resp = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const text = await resp.text();
console.log(`Status ${resp.status}`);
if (text) console.log(text);

// 200/202 = accepted. 422 = key validation failed.
if (resp.status >= 400) process.exit(1);
