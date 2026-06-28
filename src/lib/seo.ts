import type { Tool } from '../data/tools';

export const SITE_NAME = 'DevKit';
export const SITE_URL = 'https://inbrowser.sh';
export const SITE_TAGLINE = 'Fast, private developer tools — 100% in your browser.';
export const CONTACT_EMAIL = 'support@inbrowser.sh';
export const GITHUB_URL = 'https://github.com/Ailenswpu/devkit';
export const ADSENSE_PUBLISHER_ID = 'pub-4423552696854564';
export const ADSENSE_CLIENT_ID = `ca-${ADSENSE_PUBLISHER_ID}`;

// Bing Webmaster Tools site verification. Paste the value from
// bing.com/webmasters → Add site → "HTML Meta Tag" method.
// Leave empty until you have it; meta tag is skipped when empty.
export const BING_SITE_VERIFICATION = '';

// IndexNow key (32-char hex). Used by Bing, Yandex, Naver to receive
// instant-indexing pings. The same value is served from /<key>.txt
// at site root. Change it once, never again.
export const INDEXNOW_KEY = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';

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

export function howToLD(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.title}`,
    description: tool.intro,
    totalTime: 'PT1M',
    step: tool.howto.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
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

export function organizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['en'],
    },
  };
}
