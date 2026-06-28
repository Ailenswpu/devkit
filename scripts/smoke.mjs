import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('dist');
const csp = readHeader('Content-Security-Policy');
const ALLOWED_EXTERNAL_HOSTS = new Set([
  'static.cloudflareinsights.com',
  'cloudflareinsights.com',
  'pagead2.googlesyndication.com',
  'partner.googleadservices.com',
  'adservice.google.com',
  'googleads.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'ep1.adtrafficquality.google',
  'ep2.adtrafficquality.google',
  'www.google.com',
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(ROOT, url);
      try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        if (!fs.existsSync(filePath)) {
          if (fs.existsSync(filePath + '.html')) filePath = filePath + '.html';
          else { res.writeHead(404); res.end(fs.readFileSync(path.join(ROOT, '404.html'))); return; }
        }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
        if (csp) res.setHeader('Content-Security-Policy', csp);
        res.writeHead(200);
        res.end(fs.readFileSync(filePath));
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function readHeader(name) {
  const headersPath = path.join(ROOT, '_headers');
  if (!fs.existsSync(headersPath)) return '';
  const prefix = `${name}:`;
  const line = fs.readFileSync(headersPath, 'utf8')
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value.toLowerCase().startsWith(prefix.toLowerCase()));
  return line ? line.slice(prefix.length).trim() : '';
}

async function check(page, url, predicate, label) {
  const errors = [];
  const consoleErrors = [];
  page.removeAllListeners('pageerror');
  page.removeAllListeners('console');
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  const resp = await page.goto(url, { waitUntil: 'networkidle' });
  if (!resp || !resp.ok()) throw new Error(`${label}: bad status ${resp?.status()} for ${url}`);
  const result = await predicate(page);
  if (errors.length) throw new Error(`${label}: pageerror: ${errors.join('; ')}`);
  if (consoleErrors.length) console.warn(`[warn] ${label} console: ${consoleErrors.join(' | ')}`);
  console.log(`  ✓ ${label} — ${result || 'ok'}`);
}

const tools = [
  'json-formatter','json-to-csv','json-to-yaml','base64','url-encode','html-entities',
  'jwt-decoder','hash-generator','uuid-generator','regex-tester','case-converter','text-diff',
  'line-tools','number-base','color-converter','qr-code','lorem-ipsum','markdown-preview',
];

const server = await serve();
const browser = await chromium.launch();
try {
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let networkOut = [];
  page.on('request', (req) => {
    const u = req.url();
    if (!u.startsWith(baseUrl) && !u.startsWith('data:')) networkOut.push(u);
  });

  console.log('Homepage');
  await check(page, `${baseUrl}/`, async (p) => {
    const t = await p.title();
    if (!t.includes('DevKit')) throw new Error(`title missing: ${t}`);
    const links = await p.$$eval('a[href^="/"]', as => as.map(a => a.getAttribute('href')));
    if (!links.includes('/json-formatter')) throw new Error('homepage missing tool link');
    const github = await p.$('a[href="https://github.com/Ailenswpu/devkit"]');
    const contact = await p.$('a[href="mailto:support@inbrowser.sh"]');
    if (!github) throw new Error('homepage missing GitHub link');
    if (!contact) throw new Error('homepage missing contact email link');
    return `title ok, ${links.length} internal links`;
  }, 'index');

  console.log('Tools index');
  await check(page, `${baseUrl}/tools`, async (p) => {
    const count = await p.$$eval('a[href^="/"]', as => as.filter(a => /^\/[a-z]+(?:-[a-z]+)+$/.test(a.getAttribute('href') || '')).length);
    return `${count} tool cards`;
  }, 'tools');

  console.log('Trust pages');
  for (const route of ['about', 'contact', 'privacy', 'terms', 'advertising', 'changelog', 'blog']) {
    await check(page, `${baseUrl}/${route}`, async (p) => {
      const h1 = await p.$eval('h1', el => el.textContent?.trim() || '');
      if (!h1) throw new Error(`${route} missing h1`);
      const text = await p.$eval('main', el => el.textContent || '');
      if (text.length < 300) throw new Error(`${route} content too thin`);
      return h1;
    }, route);
  }

  console.log('Blog posts');
  for (const route of [
    'why-client-side-developer-tools-are-safer',
    'json-formatting-checklist-before-sharing-api-data',
    'how-to-debug-jwt-payloads-without-leaking-secrets',
    'choosing-the-right-identifier-uuid-ulid-nanoid',
    'markdown-preview-safety-for-documentation-workflows',
  ]) {
    await check(page, `${baseUrl}/blog/${route}`, async (p) => {
      const h1 = await p.$eval('h1', el => el.textContent?.trim() || '');
      const sectionCount = await p.$$eval('article section h2', els => els.length);
      const text = await p.$eval('article', el => el.textContent || '');
      if (!h1) throw new Error(`${route} missing h1`);
      if (sectionCount < 4) throw new Error(`${route} has too few sections`);
      if (text.length < 2500) throw new Error(`${route} content too thin`);
      return `${h1} (${sectionCount} sections)`;
    }, route);
  }

  console.log('Static text files');
  for (const file of ['robots.txt','llms.txt','llms-full.txt','sitemap-index.xml','ads.txt']) {
    await check(page, `${baseUrl}/${file}`, async (p) => {
      const body = await p.content();
      if (!body || body.length < 20) throw new Error(`empty ${file}`);
      if (file === 'ads.txt' && !body.includes('google.com, pub-4423552696854564, DIRECT, f08c47fec0942fa0')) {
        throw new Error('ads.txt publisher line missing');
      }
      return `${file} (${body.length} bytes)`;
    }, file);
  }

  console.log('SEO meta');
  await check(page, `${baseUrl}/json-formatter`, async (p) => {
    const desc = await p.$eval('meta[name="description"]', el => el.getAttribute('content'));
    const canonical = await p.$eval('link[rel="canonical"]', el => el.getAttribute('href'));
    const ogImage = await p.$eval('meta[property="og:image"]', el => el.getAttribute('content'));
    const ogImageType = await p.$eval('meta[property="og:image:type"]', el => el.getAttribute('content'));
    const adsense = await p.$eval('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]', el => el.getAttribute('src'));
    const lds = await p.$$eval('script[type="application/ld+json"]', els => els.map(e => JSON.parse(e.textContent || '')));
    if (!desc?.includes('JSON')) throw new Error('description missing');
    if (!canonical?.endsWith('/json-formatter')) throw new Error('canonical mismatch');
    if (!ogImage?.endsWith('/og-default.png')) throw new Error('OG image mismatch');
    if (ogImageType !== 'image/png') throw new Error('OG image type mismatch');
    if (!adsense?.includes('client=ca-pub-4423552696854564')) throw new Error('AdSense client script missing');
    const types = lds.map(l => l['@type']);
    for (const t of ['SoftwareApplication', 'BreadcrumbList', 'FAQPage']) if (!types.includes(t)) throw new Error(`missing JSON-LD ${t}`);
    return `desc ok, canonical ok, AdSense ok, JSON-LD ${types.join('+')}`;
  }, 'json-formatter SEO');

  console.log('Tool islands hydrate & work');
  // JSON Formatter
  await check(page, `${baseUrl}/json-formatter`, async (p) => {
    await p.waitForSelector('textarea[aria-label="JSON input"]');
    await p.fill('textarea[aria-label="JSON input"]', '{"a":1,"b":[2,3]}');
    await p.waitForFunction(() => {
      const out = document.querySelector('textarea[aria-label="Formatted output"]');
      return out && out.value.includes('"a": 1');
    }, null, { timeout: 5000 });
    return 'beautified';
  }, 'JsonFormatter island');

  // Base64
  await check(page, `${baseUrl}/base64`, async (p) => {
    await p.fill('textarea[aria-label="Input"]', 'hello');
    await p.waitForFunction(() => {
      const out = document.querySelectorAll('textarea[aria-label="Output"]')[0];
      return out && out.value === 'aGVsbG8=';
    }, null, { timeout: 5000 });
    await p.fill('textarea[aria-label="Input"]', '你好 🌍');
    await p.waitForFunction(() => {
      const out = document.querySelectorAll('textarea[aria-label="Output"]')[0];
      return out && out.value === '5L2g5aW9IPCfjI0=';
    }, null, { timeout: 5000 });
    await p.getByRole('tab', { name: 'Decode' }).click();
    await p.fill('textarea[aria-label="Input"]', '5L2g5aW9IPCfjI0=');
    await p.waitForFunction(() => {
      const out = document.querySelectorAll('textarea[aria-label="Output"]')[0];
      return out && out.value === '你好 🌍';
    }, null, { timeout: 5000 });
    return 'unicode encode/decode';
  }, 'Base64 island');

  // HTML entities
  await check(page, `${baseUrl}/html-entities`, async (p) => {
    await p.getByRole('tab', { name: 'Decode' }).click();
    await p.fill('textarea[aria-label="Input"]', '&#128640; &amp; &lt;tag&gt;');
    await p.waitForFunction(() => {
      const out = document.querySelectorAll('textarea[aria-label="Output"]')[0];
      return out && out.value === '🚀 & <tag>';
    }, null, { timeout: 5000 });
    return 'numeric entity decoded';
  }, 'HtmlEntities island');

  // Hash generator
  await check(page, `${baseUrl}/hash-generator`, async (p) => {
    await p.fill('textarea[aria-label="Text to hash"]', 'abc');
    await p.waitForFunction(() => {
      const codes = Array.from(document.querySelectorAll('code')).map(c => c.textContent || '');
      return codes.some(c => c === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    }, null, { timeout: 5000 });
    return 'sha256(abc) ok';
  }, 'HashGenerator island');

  // UUID
  await check(page, `${baseUrl}/uuid-generator`, async (p) => {
    const out = await p.$eval('textarea[aria-label="Generated IDs"]', el => el.value.split('\n').filter(Boolean).length);
    if (out < 1) throw new Error('no IDs');
    await p.locator('label', { hasText: 'Count' }).locator('input').fill('');
    await p.getByRole('button', { name: 'Generate' }).click();
    const clamped = await p.$eval('textarea[aria-label="Generated IDs"]', el => el.value.split('\n').filter(Boolean).length);
    if (clamped !== 1) throw new Error(`empty count should clamp to 1, got ${clamped}`);
    return `${out} default IDs, empty count clamped`;
  }, 'UuidGenerator island');

  // Lorem Ipsum
  await check(page, `${baseUrl}/lorem-ipsum`, async (p) => {
    await p.locator('label', { hasText: 'Count' }).locator('input').fill('');
    await p.waitForFunction(() => {
      const input = document.querySelector('input[type="number"]');
      const out = document.querySelector('textarea[aria-label="Generated text"]');
      return input && input.value === '1' && out && out.value.length > 0;
    }, null, { timeout: 5000 });
    return 'empty count clamped';
  }, 'LoremIpsum island');

  // Number Base
  await check(page, `${baseUrl}/number-base`, async (p) => {
    await p.fill('input[aria-label="Decimal"]', '255');
    await p.waitForFunction(() => {
      const hex = document.querySelector('input[aria-label="Hexadecimal"]');
      return hex && hex.value === 'ff';
    }, null, { timeout: 5000 });
    return '255 dec → ff hex';
  }, 'NumberBase island');

  // 404
  console.log('404 page');
  const r = await page.goto(`${baseUrl}/this-does-not-exist`);
  if (r.status() !== 404) throw new Error('expected 404');
  console.log('  ✓ 404 served');

  const unexpectedNetwork = networkOut.filter((url) => {
    try {
      return !ALLOWED_EXTERNAL_HOSTS.has(new URL(url).hostname);
    } catch {
      return true;
    }
  });
  if (unexpectedNetwork.length) {
    console.log('Unexpected external network requests:', unexpectedNetwork);
    throw new Error('Unexpected external network detected.');
  } else {
    const hosts = [...new Set(networkOut.map((url) => new URL(url).hostname))].sort();
    console.log(`Privacy: ✓ external requests limited to allowlist${hosts.length ? ` (${hosts.join(', ')})` : ''}`);
  }

  console.log('\nALL SMOKE TESTS PASSED');
} catch (e) {
  console.error('\nSMOKE FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
