import type { APIRoute } from 'astro';

export const prerender = true;
import { TOOLS, CATEGORIES } from '../data/tools';
import { CRON_PRESETS } from '../data/cronPresets';
import { SITE_URL, SITE_TAGLINE } from '../lib/seo';

export const GET: APIRoute = () => {
  const lines: string[] = [];
  lines.push(`# DevKit`);
  lines.push(`${SITE_TAGLINE}`);
  lines.push('');
  lines.push(`Home: ${SITE_URL}/`);
  lines.push(`All tools: ${SITE_URL}/tools`);
  lines.push('');
  lines.push(`## Privacy`);
  lines.push(`Every tool runs entirely in the user's browser. No upload, no signup, no tracking cookies.`);
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
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
