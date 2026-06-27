export type ToolCategory =
  | 'JSON'
  | 'Encoding'
  | 'Text'
  | 'Crypto'
  | 'Generators'
  | 'Color'
  | 'Web';

export interface Tool {
  slug: string;
  title: string;          // short label for nav/cards
  h1: string;             // page H1
  subtitle: string;       // short value prop under H1
  description: string;    // <=155 chars, meta description
  category: ToolCategory;
  keywords: string[];
  related: string[];      // related tool slugs
  intro: string;          // 1-2 sentence "what / when"
  howto: string[];        // step list
  faq: { q: string; a: string }[];
  componentId:
    | 'JsonFormatter'
    | 'Base64Tool'
    | 'UrlEncode'
    | 'HtmlEntities'
    | 'JwtDecoder'
    | 'HashGenerator'
    | 'UuidGenerator'
    | 'RegexTester'
    | 'CaseConverter'
    | 'TextDiff'
    | 'LineTools'
    | 'NumberBase'
    | 'ColorConverter'
    | 'QrCode'
    | 'LoremIpsum'
    | 'MarkdownPreview'
    | 'JsonToCsv'
    | 'JsonToYaml';
}

export const CATEGORIES: { id: ToolCategory; label: string; blurb: string }[] = [
  { id: 'JSON',       label: 'JSON',       blurb: 'Format, convert and inspect JSON.' },
  { id: 'Encoding',   label: 'Encoding',   blurb: 'Base64, URL, HTML entities and more.' },
  { id: 'Text',       label: 'Text',       blurb: 'Case, diff, dedupe, transform.' },
  { id: 'Crypto',     label: 'Crypto',     blurb: 'Hashing and token tools — all in your browser.' },
  { id: 'Generators', label: 'Generators', blurb: 'UUIDs, lorem, QR codes and more.' },
  { id: 'Color',      label: 'Color',      blurb: 'Convert and inspect color values.' },
  { id: 'Web',        label: 'Web',        blurb: 'Markdown, regex and other web helpers.' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    h1: 'JSON Formatter & Validator',
    subtitle: 'Beautify, minify and validate JSON — instantly, in your browser.',
    description: 'Free online JSON formatter, validator and minifier. 100% client-side, no upload. Pretty-print, compact, and detect syntax errors with friendly messages.',
    category: 'JSON',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minify', 'pretty print json'],
    related: ['json-to-csv', 'json-to-yaml', 'jwt-decoder'],
    intro: 'JSON Formatter is a tool that beautifies, minifies, and validates JSON documents. Use it when you need to read API responses, lint a config file, or compress JSON before shipping it.',
    howto: [
      'Paste your JSON into the input area on the left.',
      'Pick Beautify or Minify; indentation is configurable.',
      'Copy the output, or fix errors highlighted in red.',
    ],
    faq: [
      { q: 'Is this JSON formatter safe to use with sensitive data?', a: 'Yes. All parsing and formatting happens entirely in your browser. Nothing is uploaded to a server.' },
      { q: 'Does it support JSON5 or comments?', a: 'No. The formatter follows the strict JSON specification (RFC 8259). Comments and trailing commas are reported as errors.' },
      { q: 'What is the largest JSON I can format?', a: 'There is no hard limit, but browsers slow down above ~10MB. For huge files prefer a CLI like jq.' },
      { q: 'Can I copy the formatted result?', a: 'Yes — every output panel has a one-click Copy button.' },
    ],
    componentId: 'JsonFormatter',
  },
  {
    slug: 'json-to-csv',
    title: 'JSON to CSV',
    h1: 'JSON to CSV Converter',
    subtitle: 'Convert JSON arrays to CSV (and back) — entirely in your browser.',
    description: 'Free online JSON to CSV converter. Convert JSON arrays of objects to CSV, or parse CSV back to JSON. No upload, no signup.',
    category: 'JSON',
    keywords: ['json to csv', 'csv to json', 'json csv converter'],
    related: ['json-formatter', 'json-to-yaml'],
    intro: 'JSON to CSV converts an array of objects into a flat CSV table; CSV to JSON parses tabular data back into JSON. Useful when moving data between spreadsheets and APIs.',
    howto: [
      'Paste your JSON array (or CSV) into the input panel.',
      'Pick the direction: JSON→CSV or CSV→JSON.',
      'Copy the converted output.',
    ],
    faq: [
      { q: 'Does it handle nested JSON?', a: 'Nested objects are stringified into a single cell. Flatten your data first for full column expansion.' },
      { q: 'Is my data uploaded anywhere?', a: 'No. Conversion runs locally via PapaParse in your browser.' },
      { q: 'What delimiter is used?', a: 'Comma by default; the CSV is RFC 4180 compatible.' },
    ],
    componentId: 'JsonToCsv',
  },
  {
    slug: 'json-to-yaml',
    title: 'JSON ↔ YAML',
    h1: 'JSON to YAML Converter',
    subtitle: 'Convert JSON to YAML and back — fully client-side.',
    description: 'Free online JSON to YAML converter (and YAML to JSON). 100% client-side parsing using js-yaml. No upload required.',
    category: 'JSON',
    keywords: ['json to yaml', 'yaml to json', 'yaml converter'],
    related: ['json-formatter', 'json-to-csv'],
    intro: 'JSON to YAML converts between two of the most common configuration formats. Handy for Kubernetes manifests, CI configs, or anywhere YAML and JSON coexist.',
    howto: [
      'Paste JSON or YAML into the input panel.',
      'Toggle direction; output updates instantly.',
      'Copy the result.',
    ],
    faq: [
      { q: 'Which YAML spec is supported?', a: 'YAML 1.2 via js-yaml.' },
      { q: 'Are anchors and tags preserved?', a: 'Aliases are expanded; custom tags are not yet supported.' },
      { q: 'Is my YAML uploaded?', a: 'No. Everything runs in your browser.' },
    ],
    componentId: 'JsonToYaml',
  },
  {
    slug: 'base64',
    title: 'Base64',
    h1: 'Base64 Encode & Decode',
    subtitle: 'Encode text to Base64 or decode Base64 back to text — locally and instantly.',
    description: 'Free online Base64 encoder and decoder. UTF-8 safe, URL-safe variant supported. 100% client-side — your text never leaves your browser.',
    category: 'Encoding',
    keywords: ['base64', 'base64 encode', 'base64 decode', 'base64 to text'],
    related: ['url-encode', 'html-entities', 'hash-generator'],
    intro: 'Base64 represents binary data as ASCII text. It is widely used in data URIs, JWTs, email attachments, and HTTP auth headers.',
    howto: [
      'Paste text into the input area.',
      'Pick Encode or Decode; toggle URL-safe if needed.',
      'Copy the result.',
    ],
    faq: [
      { q: 'What is Base64 used for?', a: 'Carrying binary data through text-only channels — email, JSON, URLs, HTTP headers.' },
      { q: 'Is Base64 encryption?', a: 'No. Base64 is encoding, not encryption. Anyone can decode it.' },
      { q: 'What is the difference between standard and URL-safe Base64?', a: 'URL-safe Base64 replaces +/ with -_ and may omit padding, so the result is safe in URLs and filenames.' },
      { q: 'Does it handle non-ASCII characters?', a: 'Yes. Strings are encoded as UTF-8 first.' },
    ],
    componentId: 'Base64Tool',
  },
  {
    slug: 'url-encode',
    title: 'URL Encode',
    h1: 'URL Encoder & Decoder',
    subtitle: 'Percent-encode and decode URL components — instantly, in your browser.',
    description: 'Free online URL encoder/decoder. Encode query parameters, decode percent-escapes. Client-side, no upload.',
    category: 'Encoding',
    keywords: ['url encode', 'url decode', 'percent encoding', 'urlencode'],
    related: ['base64', 'html-entities'],
    intro: 'URL encoding (percent-encoding) escapes characters that are not safe inside URLs. Use it for query strings, path segments, and form data.',
    howto: [
      'Paste a URL or text segment.',
      'Pick Encode or Decode.',
      'Copy the output.',
    ],
    faq: [
      { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURI preserves reserved characters like : / ? & =. encodeURIComponent escapes them, which is what you want for a single query parameter.' },
      { q: 'Does this run on the server?', a: 'No. It uses the browser native encodeURIComponent / decodeURIComponent.' },
    ],
    componentId: 'UrlEncode',
  },
  {
    slug: 'html-entities',
    title: 'HTML Entities',
    h1: 'HTML Entities Encoder & Decoder',
    subtitle: 'Escape and unescape HTML entities — local and private.',
    description: 'Free online HTML entity encoder and decoder. Escape characters like < > & or decode &amp; back to text. No upload.',
    category: 'Encoding',
    keywords: ['html entities', 'html encode', 'html decode', 'escape html'],
    related: ['url-encode', 'base64'],
    intro: 'HTML entity encoding turns characters like < > & " into safe equivalents (&lt; &gt; &amp; &quot;) so they render correctly and prevent XSS when injecting user input.',
    howto: [
      'Paste your text or HTML.',
      'Pick Encode or Decode.',
      'Copy the output.',
    ],
    faq: [
      { q: 'Which entities does it cover?', a: 'All named HTML5 entities plus numeric character references.' },
      { q: 'Is this safe for sanitizing user input?', a: 'Encoding is one step. For full XSS protection use a sanitizer like DOMPurify in your render pipeline.' },
    ],
    componentId: 'HtmlEntities',
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    h1: 'JWT Decoder',
    subtitle: 'Decode JSON Web Tokens — header, payload and expiry, all in your browser.',
    description: 'Free online JWT decoder. Inspect header and payload, check expiry. No signature verification, no upload — your token stays local.',
    category: 'Crypto',
    keywords: ['jwt decoder', 'jwt parser', 'jwt debugger'],
    related: ['base64', 'hash-generator'],
    intro: 'A JWT (JSON Web Token) is a base64url-encoded header.payload.signature triplet. This decoder splits and pretty-prints the header and payload locally so you can inspect claims and expiry.',
    howto: [
      'Paste your JWT.',
      'Read decoded header and payload.',
      'Check the exp / iat hints.',
    ],
    faq: [
      { q: 'Does this verify the JWT signature?', a: 'No. Signature verification needs the issuer\'s key. Decoding is local-only for safety.' },
      { q: 'Is my token uploaded anywhere?', a: 'No. Decoding runs in your browser. Always rotate any token you paste into web tools.' },
      { q: 'What claims should I worry about?', a: 'exp (expiry), iat (issued at), nbf (not before), iss, aud and sub — they govern token validity and intent.' },
    ],
    componentId: 'JwtDecoder',
  },
  {
    slug: 'hash-generator',
    title: 'Hash Generator',
    h1: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
    subtitle: 'Compute cryptographic hashes of text — fully client-side.',
    description: 'Free online hash generator: MD5, SHA-1, SHA-256, SHA-384, SHA-512. Runs in your browser via Web Crypto. No upload.',
    category: 'Crypto',
    keywords: ['hash generator', 'md5', 'sha256', 'sha1', 'sha512', 'hmac'],
    related: ['jwt-decoder', 'base64', 'uuid-generator'],
    intro: 'A hash function maps input of any length to a fixed-length fingerprint. SHA-256 and SHA-512 are recommended for new code; MD5 and SHA-1 are kept for legacy compatibility only.',
    howto: [
      'Type or paste your text.',
      'All algorithms are computed instantly.',
      'Copy the digest you need.',
    ],
    faq: [
      { q: 'Is MD5 secure?', a: 'No. MD5 is broken for collision resistance. Use it only for non-security checksums.' },
      { q: 'Should I use SHA-256 or SHA-512?', a: 'Both are secure. SHA-256 is faster on 32-bit hardware; SHA-512 is faster on 64-bit. Either is fine.' },
      { q: 'Does it support file hashing?', a: 'Text input only in this release. File hashing is on the roadmap.' },
    ],
    componentId: 'HashGenerator',
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    h1: 'UUID Generator — v4, v7, ULID, NanoID',
    subtitle: 'Generate UUIDs, ULIDs and NanoIDs in bulk — locally and instantly.',
    description: 'Free online UUID generator. Create UUID v4, UUID v7, ULID and NanoID in bulk. No signup, no upload — all client-side.',
    category: 'Generators',
    keywords: ['uuid generator', 'uuid v4', 'uuid v7', 'ulid', 'nanoid'],
    related: ['hash-generator', 'qr-code'],
    intro: 'UUIDs are 128-bit identifiers used everywhere from database primary keys to session tokens. ULIDs and NanoIDs offer sortable or shorter alternatives.',
    howto: [
      'Pick a format (UUID v4, v7, ULID, NanoID).',
      'Choose how many to generate.',
      'Click Generate and copy.',
    ],
    faq: [
      { q: 'What is the difference between UUID v4 and v7?', a: 'v4 is fully random. v7 has a time-ordered prefix, making it index-friendly while still being unique.' },
      { q: 'Are these IDs cryptographically random?', a: 'Yes. They use crypto.getRandomValues under the hood.' },
      { q: 'When should I use a NanoID?', a: 'When you need shorter, URL-safe IDs while keeping low collision risk.' },
    ],
    componentId: 'UuidGenerator',
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    h1: 'Regex Tester',
    subtitle: 'Test JavaScript regular expressions live — with match highlighting and groups.',
    description: 'Free online regex tester for JavaScript. Live match highlighting, capture groups, common flags. Runs locally with ReDoS protection.',
    category: 'Web',
    keywords: ['regex tester', 'regular expression', 'regex match', 'regex playground'],
    related: ['text-diff', 'case-converter'],
    intro: 'Regex Tester lets you build and debug JavaScript regular expressions interactively. Matches highlight as you type, with group breakdowns and flag toggles.',
    howto: [
      'Type a pattern (without the slashes) and toggle flags.',
      'Paste a test string below.',
      'Inspect matches and capture groups on the right.',
    ],
    faq: [
      { q: 'What regex flavor does it use?', a: 'JavaScript (ECMAScript) regex via the native RegExp engine.' },
      { q: 'Is it safe against catastrophic backtracking?', a: 'Yes — each evaluation runs with a 1s timeout and input length cap to prevent ReDoS.' },
      { q: 'Can I share a pattern?', a: 'URL sharing is on the roadmap; for now copy/paste both pattern and flags.' },
    ],
    componentId: 'RegexTester',
  },
  {
    slug: 'case-converter',
    title: 'Case Converter',
    h1: 'Case Converter — camelCase, snake_case, kebab-case',
    subtitle: 'Convert text between camelCase, snake_case, kebab-case, PascalCase and more.',
    description: 'Free online case converter. Transform identifiers to camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE or Title Case.',
    category: 'Text',
    keywords: ['case converter', 'camelcase', 'snake case', 'kebab case', 'pascalcase'],
    related: ['line-tools', 'regex-tester'],
    intro: 'Case Converter rewrites identifiers between programming naming conventions. Useful when porting code between languages or APIs with different style guides.',
    howto: [
      'Paste your text.',
      'Pick a target case from the dropdown.',
      'Copy the converted output.',
    ],
    faq: [
      { q: 'Does it handle multi-line input?', a: 'Yes. Each line is converted independently, preserving structure.' },
      { q: 'What about acronyms in camelCase?', a: 'Consecutive uppercase letters collapse to one word (e.g. HTTPServer → httpServer).' },
    ],
    componentId: 'CaseConverter',
  },
  {
    slug: 'text-diff',
    title: 'Text Diff',
    h1: 'Text Diff Viewer',
    subtitle: 'Compare two pieces of text and see the differences instantly.',
    description: 'Free online text diff tool. Compare two snippets character-by-character. No upload, no signup — runs in your browser.',
    category: 'Text',
    keywords: ['text diff', 'compare text', 'diff viewer'],
    related: ['line-tools', 'case-converter'],
    intro: 'Text Diff highlights insertions and deletions between two text snippets. Useful for spotting subtle changes in config files, prose, or code.',
    howto: [
      'Paste the original on the left.',
      'Paste the new version on the right.',
      'Differences highlight in green (added) and red (removed).',
    ],
    faq: [
      { q: 'Is it line-based or character-based?', a: 'Character-based with word grouping for readable output.' },
      { q: 'Is my text uploaded?', a: 'No. The diff runs in your browser.' },
    ],
    componentId: 'TextDiff',
  },
  {
    slug: 'line-tools',
    title: 'Line Tools',
    h1: 'Line Tools — Sort, Dedupe, Number',
    subtitle: 'Quick line manipulation: sort, dedupe, remove blanks, add line numbers.',
    description: 'Free online line tools. Sort lines, deduplicate, remove blanks, reverse or add line numbers. Runs locally.',
    category: 'Text',
    keywords: ['sort lines', 'dedupe lines', 'remove duplicates', 'line numbers'],
    related: ['text-diff', 'case-converter'],
    intro: 'Line Tools batches the small text chores that come up daily — sorting, deduping, prepending line numbers — so you can stop dropping into a terminal for awk one-liners.',
    howto: [
      'Paste your text.',
      'Pick the operations you want.',
      'Copy the cleaned-up output.',
    ],
    faq: [
      { q: 'Is sorting locale-aware?', a: 'It uses the browser default locale via Intl.Collator.' },
      { q: 'Are duplicates case-sensitive?', a: 'Yes by default; toggle "Case-insensitive" to merge by lowercase.' },
    ],
    componentId: 'LineTools',
  },
  {
    slug: 'number-base',
    title: 'Number Base',
    h1: 'Number Base Converter — Bin · Oct · Dec · Hex',
    subtitle: 'Convert between binary, octal, decimal and hexadecimal — instantly.',
    description: 'Free online number base converter. Convert between binary, octal, decimal and hexadecimal in your browser.',
    category: 'Web',
    keywords: ['binary to decimal', 'decimal to hex', 'hex to binary', 'base converter'],
    related: ['hash-generator', 'color-converter'],
    intro: 'Number Base Converter translates a value between binary (2), octal (8), decimal (10) and hexadecimal (16) — the four bases you meet every day.',
    howto: [
      'Type a value into any of the four fields.',
      'The other three update in sync.',
      'Copy whichever you need.',
    ],
    faq: [
      { q: 'How large can the value be?', a: 'It uses BigInt, so arbitrary-precision integers are supported.' },
      { q: 'Are negative numbers supported?', a: 'Yes — a leading minus sign is preserved.' },
    ],
    componentId: 'NumberBase',
  },
  {
    slug: 'color-converter',
    title: 'Color Converter',
    h1: 'Color Converter — HEX · RGB · HSL',
    subtitle: 'Convert between HEX, RGB and HSL with a live preview.',
    description: 'Free online color converter. Convert HEX to RGB to HSL with a live preview. No upload, no signup.',
    category: 'Color',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl'],
    related: ['qr-code', 'number-base'],
    intro: 'Color Converter shows the same color in HEX, RGB and HSL side by side. Handy when porting designs between Figma, CSS and design tokens.',
    howto: [
      'Type a value in any of the inputs (e.g. #6366F1).',
      'See the preview swatch update.',
      'Copy the format you need.',
    ],
    faq: [
      { q: 'Is alpha supported?', a: 'Yes — use 8-digit hex (#RRGGBBAA) or rgba()/hsla().' },
      { q: 'Why might HSL round-trip differ?', a: 'HSL has fewer representable colors than 24-bit RGB, so values may shift by ±1.' },
    ],
    componentId: 'ColorConverter',
  },
  {
    slug: 'qr-code',
    title: 'QR Code',
    h1: 'QR Code Generator',
    subtitle: 'Generate QR codes for URLs, Wi-Fi credentials and text — fully offline.',
    description: 'Free online QR code generator. Encode URLs, text, Wi-Fi creds. Local SVG/PNG output — your data never leaves your browser.',
    category: 'Generators',
    keywords: ['qr code generator', 'qr code', 'wifi qr code'],
    related: ['uuid-generator', 'lorem-ipsum'],
    intro: 'A QR Code is a 2D barcode that any phone camera can scan. This generator runs locally so even sensitive payloads (Wi-Fi passwords, internal URLs) stay on your machine.',
    howto: [
      'Type or paste your text/URL.',
      'Pick an error correction level.',
      'Download the QR as PNG.',
    ],
    faq: [
      { q: 'How much data fits in a QR?', a: 'Up to ~4,000 characters at the lowest error-correction level, far less at the highest.' },
      { q: 'Is the QR uploaded anywhere?', a: 'No. Generation runs locally via the qrcode library.' },
    ],
    componentId: 'QrCode',
  },
  {
    slug: 'lorem-ipsum',
    title: 'Lorem Ipsum',
    h1: 'Lorem Ipsum Generator',
    subtitle: 'Generate placeholder text by words, sentences or paragraphs.',
    description: 'Free online Lorem Ipsum generator. Produce placeholder text by words, sentences or paragraphs for designs and mockups.',
    category: 'Generators',
    keywords: ['lorem ipsum', 'placeholder text generator', 'dummy text'],
    related: ['uuid-generator', 'markdown-preview'],
    intro: 'Lorem Ipsum is filler text used in design mockups. Generate exactly as much as you need — by words, sentences or paragraphs.',
    howto: [
      'Pick a unit (paragraphs, sentences, words).',
      'Choose a count.',
      'Click Generate, then copy.',
    ],
    faq: [
      { q: 'Why use Lorem Ipsum?', a: 'It avoids drawing attention to copy in a layout, so reviewers focus on visual design.' },
      { q: 'Can I get real English?', a: 'Use the "Hipster" or "English" variant from the dropdown.' },
    ],
    componentId: 'LoremIpsum',
  },
  {
    slug: 'markdown-preview',
    title: 'Markdown Preview',
    h1: 'Markdown Live Preview',
    subtitle: 'Write Markdown, see the rendered HTML side-by-side — instantly.',
    description: 'Free online Markdown editor with live preview. Sanitized rendering via marked + DOMPurify. 100% client-side.',
    category: 'Web',
    keywords: ['markdown preview', 'markdown editor', 'live markdown'],
    related: ['html-entities', 'text-diff'],
    intro: 'Markdown Preview renders GitHub-flavored Markdown on the fly so you can draft READMEs and comments with full visual feedback.',
    howto: [
      'Type Markdown on the left.',
      'See the rendered HTML on the right.',
      'Copy the HTML when you are done.',
    ],
    faq: [
      { q: 'Is the HTML sanitized?', a: 'Yes — output is sanitized via DOMPurify so it is safe to paste into a CMS.' },
      { q: 'Does it support tables and code blocks?', a: 'Yes. GFM is enabled.' },
    ],
    componentId: 'MarkdownPreview',
  },
];

export const TOOLS_BY_SLUG = new Map(TOOLS.map(t => [t.slug, t] as const));

export function getTool(slug: string): Tool {
  const t = TOOLS_BY_SLUG.get(slug);
  if (!t) throw new Error(`Unknown tool slug: ${slug}`);
  return t;
}

export function relatedTools(tool: Tool): Tool[] {
  return tool.related
    .map(slug => TOOLS_BY_SLUG.get(slug))
    .filter((t): t is Tool => Boolean(t));
}

export function toolsByCategory(): Record<ToolCategory, Tool[]> {
  const out: Record<string, Tool[]> = {};
  for (const c of CATEGORIES) out[c.id] = [];
  for (const t of TOOLS) out[t.category].push(t);
  return out as Record<ToolCategory, Tool[]>;
}
