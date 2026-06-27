import type { APIRoute } from 'astro';
import { CHANGELOG } from '../data/changelog';
import { SITE_NAME, SITE_URL, SITE_TAGLINE } from '../lib/seo';

export const prerender = true;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rfc822(dateISO: string): string {
  // YYYY-MM-DD → "Sat, 27 Jun 2026 00:00:00 GMT"
  return new Date(`${dateISO}T00:00:00Z`).toUTCString();
}

export const GET: APIRoute = () => {
  const feedUrl = `${SITE_URL}/feed.xml`;
  const lastDate = CHANGELOG[0] ? rfc822(CHANGELOG[0].date) : new Date().toUTCString();

  const items = CHANGELOG.map((e) => {
    const link = `${SITE_URL}/changelog#${e.version}`;
    const htmlBody = `<p>${esc(e.summary)}</p><ul>${e.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    return `    <item>
      <title>${esc(e.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${SITE_URL}/changelog/${e.version}</guid>
      <pubDate>${rfc822(e.date)}</pubDate>
      <description><![CDATA[${htmlBody}]]></description>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — changelog</title>
    <link>${SITE_URL}/changelog</link>
    <description>${esc(SITE_TAGLINE)} New tools and updates.</description>
    <language>en</language>
    <lastBuildDate>${lastDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  });
};
