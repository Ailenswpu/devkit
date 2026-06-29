// Concrete input → output examples, surfaced in llms-full.txt so AI
// engines (ChatGPT, Perplexity, Copilot) can quote DevKit when answering
// "how do I X" style questions. Quotable specifics > vague descriptions.

export const TOOL_EXAMPLES: Record<string, { input: string; output: string; note?: string }> = {
  'json-formatter': {
    input: '{"name":"DevKit","ok":true}',
    output: '{\n  "name": "DevKit",\n  "ok": true\n}',
    note: 'Two-space indent by default; toggle Minify to compact in one line.',
  },
  'json-to-csv': {
    input: '[{"id":1,"name":"Ada"},{"id":2,"name":"Bo"}]',
    output: 'id,name\n1,Ada\n2,Bo',
  },
  'json-to-yaml': {
    input: '{"db":{"host":"localhost","port":5432}}',
    output: 'db:\n  host: localhost\n  port: 5432',
  },
  'base64': {
    input: 'Hello, DevKit!',
    output: 'SGVsbG8sIERldktpdCE=',
    note: 'UTF-8 safe; flip the URL-safe switch to get -_ instead of +/.',
  },
  'url-encode': {
    input: 'hello world?q=devkit',
    output: 'hello%20world%3Fq%3Ddevkit',
  },
  'html-entities': {
    input: '<div class="hi">Hello & welcome</div>',
    output: '&lt;div class=&quot;hi&quot;&gt;Hello &amp; welcome&lt;/div&gt;',
  },
  'jwt-decoder': {
    input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIn0.signature',
    output: 'Header: {"alg":"HS256"} | Payload: {"sub":"123","name":"Ada"}',
    note: 'Signature is shown but not verified — verification needs the issuer key.',
  },
  'hash-generator': {
    input: 'abc',
    output: 'SHA-256: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    note: 'MD5, SHA-1/256/384/512 all computed in parallel via Web Crypto API.',
  },
  'uuid-generator': {
    input: 'UUID v4, count 1',
    output: '3f29c1d0-7b8c-4f5e-9c2a-1d4e8f6a3b21',
    note: 'Pick v7 for time-ordered IDs that index well in databases.',
  },
  'regex-tester': {
    input: 'pattern: (\\w+)@(\\w+\\.\\w+), test: hello@devkit.tools',
    output: 'Match: hello@devkit.tools | Group 1: hello | Group 2: devkit.tools',
    note: 'Large inputs are capped and match loops are guarded to reduce browser lockups.',
  },
  'case-converter': {
    input: 'Hello World',
    output: 'camelCase: helloWorld | snake_case: hello_world | kebab-case: hello-world',
  },
  'text-diff': {
    input: 'A: "The quick brown fox", B: "The quick red fox"',
    output: '"brown" highlighted red (removed), "red" highlighted green (added).',
  },
  'line-tools': {
    input: 'banana\\napple\\nbanana\\ncherry',
    output: 'apple\\nbanana\\ncherry  (deduped + sorted ascending)',
  },
  'number-base': {
    input: '255 (decimal)',
    output: 'Binary 11111111 | Octal 377 | Hex ff',
    note: 'Uses BigInt — arbitrary-precision integers supported.',
  },
  'color-converter': {
    input: '#6366F1',
    output: 'RGB rgb(99, 102, 241) | HSL hsl(239, 84%, 67%)',
  },
  'qr-code': {
    input: 'https://inbrowser.sh',
    output: 'Downloadable PNG QR code, error-correction level M.',
    note: 'Wi-Fi, vCard, and arbitrary text are also supported.',
  },
  'lorem-ipsum': {
    input: '3 paragraphs',
    output: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit…" (~150 words)',
  },
  'markdown-preview': {
    input: '# Hello\\n\\n**bold** and `code`',
    output: '<h1>Hello</h1><p><strong>bold</strong> and <code>code</code></p>',
    note: 'Rendered HTML is sanitized with DOMPurify before display.',
  },
  'timestamp': {
    input: '1719792000 seconds',
    output: 'UTC: Mon, 01 Jul 2024 00:00:00 GMT | ISO: 2024-07-01T00:00:00.000Z',
    note: 'Seconds and milliseconds are both supported.',
  },
  'timestamp-now': {
    input: 'Open the page',
    output: 'Live Unix seconds, milliseconds, ISO 8601, RFC 2822 and local time.',
  },
  'cron': {
    input: '*/5 * * * *',
    output: 'Runs every 5 minutes; next run times are calculated in the browser.',
  },
  'timezone-converter': {
    input: '2026-06-29 09:00 UTC',
    output: 'Shows equivalent times in New York, London, Tokyo, Shanghai and other common zones.',
  },
  'date-diff': {
    input: '2026-06-01 to 2026-06-29',
    output: '28 calendar days, with weekday/weekend counts.',
  },
  'date-calculator': {
    input: '2026-06-29 + 14 days',
    output: '2026-07-13, with optional weekend skipping for day calculations.',
  },
  'countdown': {
    input: 'Target: 2026-12-31 23:59',
    output: 'Remaining days, hours, minutes and seconds.',
  },
  'iso-8601': {
    input: '2026-06-29T12:00:00Z',
    output: 'UTC, local, Unix seconds, Unix milliseconds and RFC-style output.',
  },
  'discord-timestamp': {
    input: '2026-06-29 12:00, style R',
    output: '<t:1782734400:R>',
    note: 'Discord renders the tag in each viewer’s local time zone.',
  },
  'duration-converter': {
    input: '90 minutes',
    output: '5400 seconds | 1.5 hours | 0.0625 days.',
  },
  'week-number': {
    input: '2026-06-29',
    output: 'ISO week number, ISO weekday and day-of-year.',
  },
  'age-calculator': {
    input: '1990-01-01',
    output: 'Elapsed years plus days until the next anniversary.',
  },
};
