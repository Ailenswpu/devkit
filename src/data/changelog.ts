// Changelog source of truth. Drives the /changelog page and /feed.xml.
// Add new entries at the TOP (newest first). Use ISO date (YYYY-MM-DD).

export interface ChangelogEntry {
  version: string;         // semver-ish, also used to build the GUID
  date: string;            // YYYY-MM-DD
  title: string;           // short, ~6 words; appears as RSS item title
  summary: string;         // 1–2 sentences; RSS description
  items: string[];         // bullet list, shown on changelog page + as <ul> in RSS HTML
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.1.0',
    date: '2026-06-27',
    title: 'Initial release — 18 client-side dev tools',
    summary:
      'First public release of DevKit. Eighteen developer tools across JSON, encoding, text, crypto, color and web — all running 100% in the browser.',
    items: [
      'JSON Formatter, JSON ↔ CSV, JSON ↔ YAML',
      'Base64, URL encoder, HTML entities, JWT decoder',
      'Hash generator (MD5, SHA-1/256/384/512)',
      'UUID v4/v7, ULID, NanoID generators',
      'Regex tester with ReDoS protection',
      'Case converter, text diff, line tools',
      'Number base, color converter, QR code, Lorem Ipsum, Markdown preview',
      'Dark/light themes, ⌘K command palette, copy-everywhere UX',
      'Strict CSP, JSON-LD on every page, sitemap + llms.txt for AI engines',
    ],
  },
];

export function latestEntry(): ChangelogEntry | undefined {
  return CHANGELOG[0];
}
