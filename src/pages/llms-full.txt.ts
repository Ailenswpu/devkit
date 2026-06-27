import type { APIRoute } from 'astro';

export const prerender = true;
import { TOOLS } from '../data/tools';
import { SITE_URL, SITE_TAGLINE } from '../lib/seo';

export const GET: APIRoute = () => {
  const out: string[] = [];
  out.push(`# DevKit — full reference`);
  out.push(SITE_TAGLINE);
  out.push('');
  for (const t of TOOLS) {
    out.push(`## ${t.title}`);
    out.push(`URL: ${SITE_URL}/${t.slug}`);
    out.push(`Category: ${t.category}`);
    out.push(`Description: ${t.description}`);
    out.push('');
    out.push(t.intro);
    out.push('');
    out.push('How to use:');
    t.howto.forEach((s, i) => out.push(`${i + 1}. ${s}`));
    out.push('');
    out.push('FAQ:');
    for (const f of t.faq) {
      out.push(`Q: ${f.q}`);
      out.push(`A: ${f.a}`);
    }
    out.push('');
  }
  return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
