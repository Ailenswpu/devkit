import type { Tool } from '../data/tools';

export const SITE_NAME = 'DevKit';
export const SITE_URL = 'https://inbrowser.sh';
export const SITE_TAGLINE = 'Fast, private developer tools — 100% in your browser.';

export function toolTitle(tool: Tool): string {
  return `${tool.h1} — Free Online Tool | ${SITE_NAME}`;
}

export function canonical(path: string): string {
  return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}

export function softwareApplicationLD(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.h1,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: canonical('/' + tool.slug),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbLD(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: tool.category, item: canonical('/tools') },
      { '@type': 'ListItem', position: 3, name: tool.title, item: canonical('/' + tool.slug) },
    ],
  };
}

export function faqLD(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function websiteLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/tools?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}
