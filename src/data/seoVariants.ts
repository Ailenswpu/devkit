export interface SeoVariant {
  slug: string;
  toolSlug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  useCases: string[];
  example: { input: string; output: string };
  faq: { q: string; a: string }[];
  related: string[];
}

export const SEO_VARIANTS: SeoVariant[] = [
  {
    slug: 'json-formatter-no-upload',
    toolSlug: 'json-formatter',
    title: 'JSON Formatter With No Upload',
    h1: 'JSON Formatter With No Upload',
    description: 'Format, validate and minify JSON locally in your browser. No upload, no account and no server-side paste history.',
    intro: 'This no-upload JSON formatter keeps parsing and formatting in your browser, which is useful when API responses or config snippets should not be sent to a backend.',
    useCases: [
      'Pretty-print API responses before sharing a bug report.',
      'Minify a JSON payload before pasting it into a test fixture.',
      'Validate redacted JSON without creating a paste history on a server.',
    ],
    example: {
      input: '{"status":"ok","items":[1,2]}',
      output: '{\n  "status": "ok",\n  "items": [\n    1,\n    2\n  ]\n}',
    },
    faq: [
      { q: 'Does this page upload JSON to a server?', a: 'No. The linked formatter runs in the browser and does not need to post your JSON to a backend.' },
      { q: 'Can I use it for production secrets?', a: 'Avoid pasting production secrets into any web page. Use local approved tools for credentials, private keys and regulated data.' },
      { q: 'Is the canonical URL this variant page?', a: 'Yes. This page targets the no-upload JSON formatting search intent and links back to the main formatter.' },
    ],
    related: ['format-json-locally', 'client-side-jwt-decoder', 'developer-tools-that-dont-upload-your-data'],
  },
  {
    slug: 'format-json-locally',
    toolSlug: 'json-formatter',
    title: 'Format JSON Locally in Your Browser',
    h1: 'Format JSON Locally in Your Browser',
    description: 'Local browser-side JSON formatting for API responses, config snippets and examples. Pretty-print without uploading data.',
    intro: 'Formatting JSON locally means the browser does the parsing and indentation work after the static page loads. It is a good fit for low-risk debugging snippets that should not leave the device.',
    useCases: [
      'Inspect nested JSON without sending it to a third-party formatter.',
      'Clean a redacted sample for docs or support tickets.',
      'Confirm strict JSON syntax before using the payload elsewhere.',
    ],
    example: {
      input: '{"user":{"id":123,"active":true}}',
      output: '{\n  "user": {\n    "id": 123,\n    "active": true\n  }\n}',
    },
    faq: [
      { q: 'What does local JSON formatting mean?', a: 'It means the formatter uses browser JavaScript to parse and format the JSON instead of sending the input to a remote API.' },
      { q: 'Does local formatting work for huge files?', a: 'Browsers can slow down on very large JSON. For huge files, use a local CLI such as jq.' },
      { q: 'Where should I go for the interactive tool?', a: 'Use the main JSON Formatter page at /json-formatter.' },
    ],
    related: ['json-formatter-no-upload', 'json-to-csv', 'json-to-yaml'],
  },
  {
    slug: 'offline-base64-decode',
    toolSlug: 'base64',
    title: 'Offline Base64 Decode',
    h1: 'Offline Base64 Decode',
    description: 'Decode Base64 text in your browser with no upload. Useful for headers, data snippets and UTF-8 strings.',
    intro: 'Base64 decoding is a simple text transformation that can run locally in the browser. After the page assets are loaded, the input does not need to be sent to a server.',
    useCases: [
      'Decode a Base64 string from an HTTP header or config file.',
      'Check whether a Base64 value is standard or URL-safe.',
      'Inspect a non-secret encoded snippet without server processing.',
    ],
    example: {
      input: 'SGVsbG8sIGluYnJvd3Nlci5zaCE=',
      output: 'Hello, inbrowser.sh!',
    },
    faq: [
      { q: 'Is Base64 decoding encryption?', a: 'No. Base64 is encoding, not encryption. Anyone with the string can decode it.' },
      { q: 'Does decoding happen on a server?', a: 'No. The Base64 tool decodes in the browser.' },
      { q: 'Can it decode URL-safe Base64?', a: 'Yes. The main Base64 tool includes a URL-safe option.' },
    ],
    related: ['base64-encode', 'base64-decode', 'string-to-base64'],
  },
  {
    slug: 'client-side-jwt-decoder',
    toolSlug: 'jwt-decoder',
    title: 'Client-Side JWT Decoder',
    h1: 'Client-Side JWT Decoder',
    description: 'Decode JWT header and payload locally in your browser. No upload and no server-side token processing.',
    intro: 'A client-side JWT decoder reads the base64url header and payload in the browser. It helps inspect claims without sending the token to a remote decode API.',
    useCases: [
      'Check exp, iat and nbf claim values while debugging auth failures.',
      'Inspect issuer, audience and scope claims before writing a bug report.',
      'Create a redacted example from a token payload.',
    ],
    example: {
      input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.signature',
      output: 'Header: {"alg":"HS256"}\nPayload: {"sub":"123","role":"admin"}',
    },
    faq: [
      { q: 'Does decoding verify the JWT signature?', a: 'No. Decoding only reads the header and payload. Verification requires the issuer key and expected algorithm.' },
      { q: 'Should I paste production bearer tokens?', a: 'Avoid pasting live bearer tokens into any external page. Rotate a token if it may have been exposed.' },
      { q: 'Does the decoder upload my token?', a: 'No. The decoding logic runs in the browser.' },
    ],
    related: ['jwt-decoder', 'offline-base64-decode', 'developer-tools-that-dont-upload-your-data'],
  },
  {
    slug: 'regex-tester-no-data-sent',
    toolSlug: 'regex-tester',
    title: 'Regex Tester With No Data Sent',
    h1: 'Regex Tester With No Data Sent',
    description: 'Test JavaScript regex patterns in your browser without uploading sample text to a server.',
    intro: 'Regex samples often include logs, IDs, URLs or copied user-facing text. A browser-side tester can highlight matches without posting that sample to a backend.',
    useCases: [
      'Test a JavaScript regex against a redacted log line.',
      'Check capture groups before adding a pattern to code.',
      'Debug validation patterns without creating server logs.',
    ],
    example: {
      input: 'Pattern: (\\w+)@(\\w+\\.\\w+)\nText: support@inbrowser.sh',
      output: 'Match: support@inbrowser.sh\nGroup 1: support\nGroup 2: inbrowser.sh',
    },
    faq: [
      { q: 'Which regex flavor is supported?', a: 'The main tool uses JavaScript regular expressions.' },
      { q: 'Is sample text uploaded?', a: 'No. Matching runs in the browser.' },
      { q: 'Can regex testing freeze a tab?', a: 'Pathological patterns can be expensive. Keep samples small and review complex expressions carefully.' },
    ],
    related: ['regex-tester', 'developer-tools-that-dont-upload-your-data', 'online-vs-local-developer-tools-data-flow'],
  },
  {
    slug: 'hash-generator-offline',
    toolSlug: 'hash-generator',
    title: 'Offline Hash Generator',
    h1: 'Offline Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes locally in your browser with no upload.',
    intro: 'Hashing text does not require a backend. The browser can calculate common digests locally, which is useful for checksums, cache keys and quick comparisons.',
    useCases: [
      'Generate a SHA-256 digest for a sample string.',
      'Compare checksums without uploading the original text.',
      'Create MD5 or SHA values for non-secret test data.',
    ],
    example: {
      input: 'abc',
      output: 'SHA-256: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    },
    faq: [
      { q: 'Does hashing encrypt data?', a: 'No. Hashing creates a digest. It is not reversible encryption.' },
      { q: 'Is the input uploaded?', a: 'No. Hash generation runs locally in the browser.' },
      { q: 'Should I hash production secrets here?', a: 'Use approved local tooling for production secrets and regulated values.' },
    ],
    related: ['sha256-generator', 'md5-generator', 'sha1-generator'],
  },
  {
    slug: 'json-validator-no-upload',
    toolSlug: 'json-formatter',
    title: 'JSON Validator With No Upload',
    h1: 'JSON Validator With No Upload',
    description: 'Validate strict JSON locally in your browser. Find syntax errors without uploading API responses or config snippets.',
    intro: 'A no-upload JSON validator checks syntax in the browser after the page loads. It is useful when you need to confirm whether a payload is valid JSON without posting the content to a remote API.',
    useCases: [
      'Check an API response before opening a bug ticket.',
      'Validate a config snippet after redacting sensitive values.',
      'Find trailing commas, comments or malformed strings in strict JSON.',
    ],
    example: {
      input: '{"ok":true,"items":[1,2,]}',
      output: 'Invalid JSON: trailing comma before ]',
    },
    faq: [
      { q: 'Does validation upload my JSON?', a: 'No. The linked JSON Formatter validates in the browser.' },
      { q: 'Does it support comments or JSON5?', a: 'No. It validates strict JSON, so comments and trailing commas are errors.' },
      { q: 'What should I use for very large JSON?', a: 'For very large files, use a local CLI such as jq or a local editor to avoid browser slowdowns.' },
    ],
    related: ['json-formatter-no-upload', 'format-json-locally', 'json-formatter'],
  },
  {
    slug: 'base64-encoder-no-upload',
    toolSlug: 'base64',
    title: 'Base64 Encoder With No Upload',
    h1: 'Base64 Encoder With No Upload',
    description: 'Encode UTF-8 text to Base64 locally in your browser. No upload, no account and no server-side paste history.',
    intro: 'Base64 encoding is a simple text transformation, so the browser can encode UTF-8 strings locally without sending the input to a backend.',
    useCases: [
      'Encode a non-secret string for a demo header or data snippet.',
      'Create a Base64 example for documentation.',
      'Compare standard and URL-safe Base64 output locally.',
    ],
    example: {
      input: 'Hello, inbrowser.sh!',
      output: 'SGVsbG8sIGluYnJvd3Nlci5zaCE=',
    },
    faq: [
      { q: 'Is Base64 encoding secure?', a: 'No. Base64 is reversible encoding, not encryption.' },
      { q: 'Does encoding happen on a server?', a: 'No. The Base64 tool runs in the browser.' },
      { q: 'Can it encode non-ASCII text?', a: 'Yes. Strings are encoded as UTF-8 first.' },
    ],
    related: ['base64-encode', 'offline-base64-decode', 'string-to-base64'],
  },
  {
    slug: 'url-decoder-no-upload',
    toolSlug: 'url-encode',
    title: 'URL Decoder With No Upload',
    h1: 'URL Decoder With No Upload',
    description: 'Decode percent-encoded URL text locally in your browser. No upload required for query strings or path segments.',
    intro: 'URL decoding turns percent escapes such as %20 and %3D back into readable characters. For everyday query-string debugging, the browser can do this locally.',
    useCases: [
      'Decode a copied query parameter while debugging redirects.',
      'Inspect an encoded path segment in a log line.',
      'Check whether a value was encoded once or twice.',
    ],
    example: {
      input: 'hello%20world%3Fq%3Dinbrowser',
      output: 'hello world?q=inbrowser',
    },
    faq: [
      { q: 'Does URL decoding upload the URL?', a: 'No. Decoding uses browser-side JavaScript.' },
      { q: 'What causes decode errors?', a: 'Malformed percent escapes or invalid UTF-8 sequences can cause decoding to fail.' },
      { q: 'Should I decode full URLs or components?', a: 'Decode individual components when possible so reserved characters remain clear.' },
    ],
    related: ['url-decode-online', 'url-encode-online', 'url-encode'],
  },
  {
    slug: 'local-unix-timestamp-converter',
    toolSlug: 'timestamp',
    title: 'Local Unix Timestamp Converter',
    h1: 'Local Unix Timestamp Converter',
    description: 'Convert Unix timestamps to dates locally in your browser. Compare seconds, milliseconds, UTC and local output.',
    intro: 'A local Unix timestamp converter maps epoch seconds or milliseconds to readable dates in the browser, which is useful for logs, APIs and scheduled jobs.',
    useCases: [
      'Convert a 10-digit epoch value from an API response.',
      'Check whether a 13-digit value is milliseconds.',
      'Compare UTC and local time before documenting an incident.',
    ],
    example: {
      input: '1719792000',
      output: '2024-07-01T00:00:00.000Z',
    },
    faq: [
      { q: 'Does timestamp conversion need a backend?', a: 'No. The browser can parse and format epoch values locally.' },
      { q: 'How do I tell seconds from milliseconds?', a: 'Current Unix seconds are 10 digits; current Unix milliseconds are usually 13 digits.' },
      { q: 'Which time zone should I trust?', a: 'Use UTC for shared logs and local time only when the user-facing context needs it.' },
    ],
    related: ['epoch-to-date', 'date-to-epoch', 'timestamp-now'],
  },
  {
    slug: 'cron-expression-explainer-local',
    toolSlug: 'cron',
    title: 'Local Cron Expression Explainer',
    h1: 'Local Cron Expression Explainer',
    description: 'Explain five-field cron expressions in your browser and preview upcoming run times with an explicit time zone.',
    intro: 'A local cron expression explainer helps translate schedules such as */5 * * * * without sending the expression to a server. It is best for common five-field crontab syntax.',
    useCases: [
      'Check a schedule before adding it to a CI job.',
      'Preview upcoming run times in UTC or another IANA time zone.',
      'Compare common cron presets before copying one into production.',
    ],
    example: {
      input: '0 9 * * 1-5',
      output: 'Runs at 09:00 Monday through Friday.',
    },
    faq: [
      { q: 'Does the cron explainer support seconds?', a: 'No. It focuses on common five-field crontab syntax.' },
      { q: 'Does cron use local time?', a: 'Cron uses the scheduler or server time zone. Always verify the platform setting.' },
      { q: 'Is the expression uploaded?', a: 'No. Explanation and preview run in the browser.' },
    ],
    related: ['cron', 'timezone-converter', 'date-calculator'],
  },
  {
    slug: 'html-escape-no-upload',
    toolSlug: 'html-entities',
    title: 'HTML Escape With No Upload',
    h1: 'HTML Escape With No Upload',
    description: 'Escape HTML characters locally in your browser. Convert <, >, &, quotes and entities without uploading text.',
    intro: 'HTML escaping turns characters such as <, > and & into entity-safe text. This browser-side workflow is useful for examples, docs and quick cleanup.',
    useCases: [
      'Escape a code snippet before placing it in documentation.',
      'Turn literal HTML into display-safe text.',
      'Decode or encode small examples without creating a server-side paste record.',
    ],
    example: {
      input: '<strong>Hello</strong>',
      output: '&lt;strong&gt;Hello&lt;/strong&gt;',
    },
    faq: [
      { q: 'Is HTML escaping the same as sanitizing?', a: 'No. Escaping is one output-encoding step. Use a sanitizer for untrusted HTML rendering.' },
      { q: 'Does escaping upload my text?', a: 'No. The HTML Entities tool runs in your browser.' },
      { q: 'Can I unescape entities too?', a: 'Yes. Use the decode mode in the HTML Entities tool.' },
    ],
    related: ['html-escape', 'html-unescape', 'html-entities'],
  },
];

export const SEO_VARIANTS_BY_SLUG = new Map(SEO_VARIANTS.map((variant) => [variant.slug, variant] as const));
