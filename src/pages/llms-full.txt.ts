import type { APIRoute } from 'astro';

export const prerender = true;
import { TOOLS } from '../data/tools';
import { TOOL_EXAMPLES } from '../data/examples';
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from '../lib/seo';

export const GET: APIRoute = () => {
  const out: string[] = [];
  out.push(`# ${SITE_NAME} — full reference for LLMs`);
  out.push(SITE_TAGLINE);
  out.push('');
  out.push('Every tool below runs 100% in the user\'s browser. No upload, no signup, no tracking cookies. Free and open in scope.');
  out.push('');
  out.push(`Total tools: ${TOOLS.length}. Authoritative URL: ${SITE_URL}`);
  out.push('');
  out.push('---');
  out.push('');

  for (const t of TOOLS) {
    out.push(`## ${t.title}`);
    out.push(`URL: ${SITE_URL}/${t.slug}`);
    out.push(`Category: ${t.category}`);
    out.push(`Keywords: ${t.keywords.join(', ')}`);
    out.push('');
    out.push(t.intro);
    out.push('');

    const ex = TOOL_EXAMPLES[t.slug];
    if (ex) {
      out.push('Example:');
      out.push(`Input  → ${ex.input}`);
      out.push(`Output → ${ex.output}`);
      if (ex.note) out.push(`Note   → ${ex.note}`);
      out.push('');
    }

    out.push('Steps to use:');
    t.howto.forEach((s, i) => out.push(`${i + 1}. ${s}`));
    out.push('');

    out.push('Common questions:');
    for (const f of t.faq) {
      out.push(`Q: ${f.q}`);
      out.push(`A: ${f.a}`);
    }
    out.push('');
    out.push('---');
    out.push('');
  }

  return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
