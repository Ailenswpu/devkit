import type { APIRoute } from 'astro';

export const prerender = true;
import { TOOLS, CATEGORIES } from '../data/tools';
import { CRON_PRESETS } from '../data/cronPresets';
import { BLOG_POSTS } from '../data/blog';
import { SEO_VARIANTS } from '../data/seoVariants';
import { CONVERSION_PAGES } from '../data/conversions';
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from '../lib/seo';

export const GET: APIRoute = () => {
  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push(`${SITE_TAGLINE}`);
  lines.push('');
  lines.push(`Home: ${SITE_URL}/`);
  lines.push(`All tools: ${SITE_URL}/tools`);
  lines.push('');
  lines.push(`## Privacy`);
  lines.push(`Every tool runs entirely in the user's browser. No upload, no signup, no tracking cookies.`);
  lines.push('');
  lines.push('## Primary Markdown conversion module');
  lines.push(`- To Markdown: ${SITE_URL}/to-markdown — Convert HTML, PDF, DOCX, XLSX, CSV, TSV, PPTX, JSON, RSS, RTF and text to Markdown in the browser.`);
  lines.push(`- HTML to Markdown: ${SITE_URL}/html-to-markdown — Browser-side HTML and saved webpage conversion with readable article extraction.`);
  lines.push(`- PDF to Markdown: ${SITE_URL}/pdf-to-markdown — Best-effort local PDF text extraction for Markdown, with layout caveats.`);
  lines.push(`- DOCX to Markdown: ${SITE_URL}/docx-to-markdown — Convert Word documents to Markdown locally.`);
  lines.push(`- CSV to Markdown: ${SITE_URL}/csv-to-markdown — Convert CSV or TSV to GitHub-flavored Markdown tables locally.`);
  lines.push('');
  for (const cat of CATEGORIES) {
    const tools = TOOLS.filter(t => t.category === cat.id);
    if (tools.length === 0) continue;
    lines.push(`## ${cat.label}`);
    for (const t of tools) {
      lines.push(`- ${t.title}: ${SITE_URL}/${t.slug} — ${t.subtitle}`);
    }
    lines.push('');
  }
  lines.push('## Cron schedule quick reference');
  for (const preset of CRON_PRESETS) {
    lines.push(`- ${preset.title}: ${SITE_URL}/cron/${preset.slug} — ${preset.expression} means ${preset.meaning}`);
  }
  lines.push('');
  lines.push('## Privacy and comparison guides');
  for (const post of BLOG_POSTS) {
    lines.push(`- ${post.title}: ${SITE_URL}/blog/${post.slug} — ${post.description}`);
  }
  lines.push('');
  lines.push('## No-upload and offline intent pages');
  for (const variant of SEO_VARIANTS) {
    lines.push(`- ${variant.title}: ${SITE_URL}/${variant.slug} — ${variant.description}`);
  }
  lines.push('');
  lines.push('## Conversion quick reference pages');
  for (const conversion of CONVERSION_PAGES.filter(page => page.toolSlug !== 'to-markdown')) {
    lines.push(`- ${conversion.title}: ${SITE_URL}/${conversion.slug} — ${conversion.example.input} => ${conversion.example.output}`);
  }
  lines.push('');
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
