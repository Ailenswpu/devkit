import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('dist');
const PORT = 4322;

const MIME = { '.html':'text/html;charset=utf-8','.js':'application/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain;charset=utf-8','.xml':'application/xml;charset=utf-8','.json':'application/json','.ico':'image/x-icon' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let p = path.join(ROOT, url);
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) p = path.join(ROOT, '404.html');
  const ext = path.extname(p).toLowerCase();
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(p));
});
await new Promise(r => server.listen(PORT, r));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const targets = [
  { url: '/',                 file: 'home.png' },
  { url: '/tools',            file: 'tools.png' },
  { url: '/json-formatter',   file: 'json-formatter.png' },
  { url: '/hash-generator',   file: 'hash-generator.png' },
  { url: '/uuid-generator',   file: 'uuid-generator.png' },
  { url: '/qr-code',          file: 'qr-code.png' },
];

fs.mkdirSync('screenshots', { recursive: true });
for (const t of targets) {
  await page.goto(`http://localhost:${PORT}${t.url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `screenshots/${t.file}`, fullPage: false });
  console.log('shot', t.file);
}

await browser.close();
server.close();
