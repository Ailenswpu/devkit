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

const BASE_SEO_VARIANTS: SeoVariant[] = [
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

const CRON_PLATFORM_VARIANTS: SeoVariant[] = [
  {
    slug: 'spring-cron-expression-generator',
    toolSlug: 'cron',
    title: 'Spring Cron Expression Generator',
    h1: 'Spring Cron Expression Generator',
    description: 'Build and explain Spring-style cron schedules with examples, field notes and a link to the local cron parser.',
    intro: 'Spring scheduled tasks commonly use six-field cron expressions with a seconds field. This reference page shows practical Spring cron examples and links to the browser-side cron parser for five-field equivalents.',
    useCases: [
      'Translate a Spring @Scheduled cron expression into plain English.',
      'Compare a six-field Spring schedule with a five-field crontab equivalent.',
      'Preview common daily, hourly and weekday schedules before shipping a job.',
    ],
    example: {
      input: '0 */15 * * * *',
      output: 'Spring: run every 15 minutes when seconds = 0. Five-field equivalent: */15 * * * *',
    },
    faq: [
      { q: 'Why does Spring cron have six fields?', a: 'Spring cron expressions include seconds first, followed by minute, hour, day of month, month and day of week.' },
      { q: 'Can the main parser preview this exact six-field expression?', a: 'The main parser focuses on five-field crontab syntax. Drop the leading seconds field when you need a five-field equivalent.' },
      { q: 'Should I use UTC for Spring jobs?', a: 'Use an explicit zone when possible so deployments do not inherit an unexpected server time zone.' },
    ],
    related: ['cron', 'cron-expression-explainer-local', 'quartz-cron-expression-generator'],
  },
  {
    slug: 'quartz-cron-expression-generator',
    toolSlug: 'cron',
    title: 'Quartz Cron Expression Generator',
    h1: 'Quartz Cron Expression Generator',
    description: 'Reference Quartz cron syntax with seconds, question marks, examples and five-field crontab equivalents.',
    intro: 'Quartz cron syntax is common in Java schedulers and differs from standard crontab because it includes seconds and supports special characters such as ? in day fields.',
    useCases: [
      'Understand a Quartz cron expression before adding it to a scheduler.',
      'Convert common schedules to a simpler crontab-style equivalent for comparison.',
      'Document whether a job runs daily, weekly, monthly or on business days.',
    ],
    example: {
      input: '0 0 9 ? * MON-FRI',
      output: 'Quartz: run at 09:00 Monday through Friday. Five-field equivalent: 0 9 * * 1-5',
    },
    faq: [
      { q: 'What does ? mean in Quartz cron?', a: 'It means no specific value for either day-of-month or day-of-week when the other field is used.' },
      { q: 'Is Quartz cron the same as Linux crontab?', a: 'No. Linux crontab typically uses five fields. Quartz normally uses six or seven fields.' },
      { q: 'Can I preview related five-field schedules?', a: 'Yes. Use the main Cron Parser with the five-field equivalent shown in the example.' },
    ],
    related: ['spring-cron-expression-generator', 'cron', 'cron-expression-explainer-local'],
  },
  {
    slug: 'aws-eventbridge-cron-generator',
    toolSlug: 'cron',
    title: 'AWS EventBridge Cron Generator',
    h1: 'AWS EventBridge Cron Generator',
    description: 'Draft AWS EventBridge cron schedules with UTC notes, examples and crontab-style comparisons.',
    intro: 'AWS EventBridge scheduled rules use a six-field cron expression wrapped in cron(...), and schedules are evaluated in UTC unless you use scheduler-specific time zone settings.',
    useCases: [
      'Draft a daily or weekday EventBridge schedule.',
      'Compare AWS cron syntax with standard five-field crontab.',
      'Avoid local-time assumptions when documenting scheduled rules.',
    ],
    example: {
      input: 'cron(0 9 ? * MON-FRI *)',
      output: 'AWS EventBridge: run at 09:00 UTC Monday through Friday.',
    },
    faq: [
      { q: 'Does EventBridge cron use UTC?', a: 'Classic EventBridge rules are UTC-based. Check EventBridge Scheduler settings if you need a named time zone.' },
      { q: 'Why is there a year field?', a: 'AWS cron includes a year field as the sixth position after day-of-week.' },
      { q: 'Can I test a five-field equivalent?', a: 'Use 0 9 * * 1-5 in the Cron Parser to preview the matching weekday schedule.' },
    ],
    related: ['cron', 'azure-functions-cron-generator', 'github-actions-cron-generator'],
  },
  {
    slug: 'azure-functions-cron-generator',
    toolSlug: 'cron',
    title: 'Azure Functions Cron Generator',
    h1: 'Azure Functions Cron Generator',
    description: 'Understand Azure Functions timer cron schedules with examples, UTC notes and five-field equivalents.',
    intro: 'Azure Functions timer triggers use NCRONTAB expressions with six fields, starting with seconds. This page gives common examples and safer wording for scheduled jobs.',
    useCases: [
      'Create a timer trigger schedule for a daily Azure Function.',
      'Compare NCRONTAB seconds-first syntax with normal crontab.',
      'Document the schedule and time zone assumptions for operations review.',
    ],
    example: {
      input: '0 */30 * * * *',
      output: 'Azure Functions: run every 30 minutes when seconds = 0. Five-field equivalent: */30 * * * *',
    },
    faq: [
      { q: 'Why does Azure timer syntax start with 0?', a: 'The first field is seconds. Many common schedules set it to 0.' },
      { q: 'Is Azure Functions timer trigger local time?', a: 'Timer triggers are often treated as UTC in cloud hosting. Verify app and platform settings before relying on local time.' },
      { q: 'Where can I preview the equivalent?', a: 'Drop the leading seconds field and use the main Cron Parser for common five-field schedules.' },
    ],
    related: ['aws-eventbridge-cron-generator', 'cron', 'cron-expression-explainer-local'],
  },
  {
    slug: 'github-actions-cron-generator',
    toolSlug: 'cron',
    title: 'GitHub Actions Cron Generator',
    h1: 'GitHub Actions Cron Generator',
    description: 'Build GitHub Actions schedule cron expressions with UTC examples and local preview links.',
    intro: 'GitHub Actions scheduled workflows use five-field POSIX cron and run on UTC. This page gives common schedules you can preview locally before editing workflow YAML.',
    useCases: [
      'Draft a nightly GitHub Actions workflow schedule.',
      'Convert weekday or hourly schedules into on.schedule syntax.',
      'Confirm that a workflow uses UTC rather than your local time zone.',
    ],
    example: {
      input: '0 3 * * 1-5',
      output: 'Run at 03:00 UTC Monday through Friday.',
    },
    faq: [
      { q: 'Does GitHub Actions cron use UTC?', a: 'Yes. Scheduled workflows are evaluated in UTC.' },
      { q: 'Can I use the main parser directly?', a: 'Yes. GitHub Actions uses standard five-field cron, so paste the expression into the Cron Parser.' },
      { q: 'Where does the expression go?', a: 'Use it under on.schedule with a cron value in your workflow YAML.' },
    ],
    related: ['cron', 'cron-expression-explainer-local', 'aws-eventbridge-cron-generator'],
  },
  {
    slug: 'kubernetes-cronjob-schedule-generator',
    toolSlug: 'cron',
    title: 'Kubernetes CronJob Schedule Generator',
    h1: 'Kubernetes CronJob Schedule Generator',
    description: 'Create Kubernetes CronJob schedule expressions with five-field examples, UTC notes and preview links.',
    intro: 'Kubernetes CronJobs use standard five-field cron syntax in the spec.schedule field. This page collects common schedules and points to the local parser for next-run previews.',
    useCases: [
      'Draft a spec.schedule value for a Kubernetes CronJob.',
      'Check hourly, daily and weekday jobs before applying YAML.',
      'Document time zone behavior for cluster operations.',
    ],
    example: {
      input: '0 */6 * * *',
      output: 'Run every six hours at minute 0.',
    },
    faq: [
      { q: 'Does Kubernetes CronJob use five fields?', a: 'Yes. The schedule field uses standard minute, hour, day-of-month, month and day-of-week syntax.' },
      { q: 'Can I preview it in the main tool?', a: 'Yes. Paste the expression into the Cron Parser.' },
      { q: 'Should I set a time zone?', a: 'Use the time zone controls supported by your Kubernetes version and cluster policy when local time matters.' },
    ],
    related: ['cron', 'github-actions-cron-generator', 'cron-expression-explainer-local'],
  },
];

const UUID_VARIANTS: SeoVariant[] = [
  {
    slug: 'uuid-v7-generator',
    toolSlug: 'uuid-generator',
    title: 'UUID v7 Generator',
    h1: 'UUID v7 Generator',
    description: 'Generate time-ordered UUID v7 values locally in your browser. Bulk output, no upload and no signup.',
    intro: 'UUID v7 keeps a timestamp-ordered prefix while preserving random bits for uniqueness. It is useful for database keys that should sort better than UUID v4.',
    useCases: [
      'Generate sortable IDs for seed records or local fixtures.',
      'Compare UUID v7 with UUID v4, ULID and NanoID output.',
      'Create bulk identifiers without calling a backend service.',
    ],
    example: {
      input: 'Format: UUID v7, count: 3',
      output: '0190f6fb-7c6b-7b88-9d84-6a1ec1f4c6a1\n0190f6fb-7c6c-7b89-9f52-1cf5df7a3a91',
    },
    faq: [
      { q: 'Is UUID v7 better than UUID v4?', a: 'It depends. UUID v7 is often friendlier for database indexes because values are roughly time ordered.' },
      { q: 'Does generation happen locally?', a: 'Yes. The UUID Generator runs in the browser.' },
      { q: 'Can I generate UUID v4 too?', a: 'Yes. The same tool supports UUID v4, UUID v7, ULID and NanoID.' },
    ],
    related: ['uuid-generator', 'ulid-generator', 'nanoid-generator', 'mock-data-generator'],
  },
  {
    slug: 'uuid-v7-generator-postgres',
    toolSlug: 'uuid-generator',
    title: 'UUID v7 Generator for Postgres',
    h1: 'UUID v7 Generator for Postgres',
    description: 'Generate UUID v7 examples for Postgres seed data and migrations. Local browser-side output with no upload.',
    intro: 'Postgres UUID columns can store UUID v7 strings just like other UUID values. Use this page when you need sortable-looking fixture IDs before writing migrations or seed scripts.',
    useCases: [
      'Create UUID v7 values for local Postgres seed data.',
      'Compare UUID v7 ordering behavior with UUID v4 fixtures.',
      'Generate IDs without depending on database extensions during a quick mockup.',
    ],
    example: {
      input: 'INSERT INTO accounts (id, name) VALUES (...)',
      output: "INSERT INTO accounts (id, name) VALUES ('0190f6fb-7c6b-7b88-9d84-6a1ec1f4c6a1', 'Demo account');",
    },
    faq: [
      { q: 'Does Postgres require a special UUID v7 type?', a: 'No. UUID v7 values are still UUID strings and fit in the uuid type.' },
      { q: 'Should production IDs be generated in the browser?', a: 'No. Use application or database-side generation for production writes.' },
      { q: 'Can the tool generate many values?', a: 'Yes. The UUID Generator can produce bulk UUID v7 output locally.' },
    ],
    related: ['uuid-v7-generator', 'mock-data-generator', 'sql-insert-generator'],
  },
  {
    slug: 'uuid-v7-generator-javascript',
    toolSlug: 'uuid-generator',
    title: 'UUID v7 Generator for JavaScript',
    h1: 'UUID v7 Generator for JavaScript',
    description: 'Generate UUID v7 values for JavaScript examples and fixtures. Runs locally in your browser.',
    intro: 'JavaScript projects often need throwaway IDs for mocks, tests and docs. This UUID v7 page links to the local generator and shows a practical code-oriented example.',
    useCases: [
      'Create fixture IDs for frontend tests.',
      'Compare browser-generated UUID v7 output with package output.',
      'Prepare examples for docs and API samples.',
    ],
    example: {
      input: "import { v7 as uuidv7 } from 'uuid';",
      output: "const id = '0190f6fb-7c6b-7b88-9d84-6a1ec1f4c6a1';",
    },
    faq: [
      { q: 'Can browsers generate UUID v7 natively?', a: 'Browsers expose crypto.randomUUID for v4. UUID v7 usually comes from a library.' },
      { q: 'Is the inbrowser.sh generator server-side?', a: 'No. It runs in the browser.' },
      { q: 'Can I copy one ID per line?', a: 'Yes. Bulk output is newline-separated for easy copying.' },
    ],
    related: ['uuid-v7-generator', 'uuid-generator', 'nanoid-generator'],
  },
  {
    slug: 'ulid-generator',
    toolSlug: 'uuid-generator',
    title: 'ULID Generator',
    h1: 'ULID Generator',
    description: 'Generate sortable ULID values locally in your browser. Bulk output with no upload.',
    intro: 'ULID combines a timestamp prefix with random data and encodes the result in a compact, sortable string. It is a common alternative to UUIDs for logs, fixtures and IDs.',
    useCases: [
      'Generate sortable IDs for seed records.',
      'Compare ULID output with UUID v7 and NanoID.',
      'Create compact examples for docs or local tests.',
    ],
    example: {
      input: 'Format: ULID, count: 2',
      output: '01J1X9VY7K0GB6RY4N9Y0Z4F2E\n01J1X9VY7M5WH8A1TR8SKK2B8Q',
    },
    faq: [
      { q: 'Is ULID a UUID?', a: 'No. It is a separate 128-bit identifier format with Crockford Base32 text encoding.' },
      { q: 'Does it sort by creation time?', a: 'ULIDs sort lexicographically by timestamp prefix when generated normally.' },
      { q: 'Does generation upload anything?', a: 'No. The generator runs locally.' },
    ],
    related: ['uuid-v7-generator', 'uuid-generator', 'nanoid-generator'],
  },
  {
    slug: 'nanoid-generator',
    toolSlug: 'uuid-generator',
    title: 'NanoID Generator',
    h1: 'NanoID Generator',
    description: 'Generate URL-safe NanoID values locally in your browser. Choose count and size with no upload.',
    intro: 'NanoID is a compact, URL-safe identifier often used when UUID strings feel too long. The generator lets you choose output size and count locally.',
    useCases: [
      'Generate short IDs for local fixtures and demos.',
      'Create URL-safe identifiers for examples.',
      'Compare NanoID length with UUID and ULID output.',
    ],
    example: {
      input: 'Format: NanoID, size: 12',
      output: 'V1StGXR8_Z5j',
    },
    faq: [
      { q: 'Is NanoID URL-safe?', a: 'The default alphabet is URL-safe.' },
      { q: 'Can I change the length?', a: 'Yes. The UUID Generator exposes a NanoID size field.' },
      { q: 'Is shorter always better?', a: 'No. Shorter IDs have higher collision risk. Choose length based on volume and risk.' },
    ],
    related: ['uuid-v7-generator', 'uuid-generator', 'ulid-generator'],
  },
];

const MOCK_DATA_VARIANTS: SeoVariant[] = [
  {
    slug: 'test-data-generator-online',
    toolSlug: 'mock-data-generator',
    title: 'Test Data Generator Online',
    h1: 'Test Data Generator Online',
    description: 'Generate online test data as JSON, CSV or SQL fixtures. Synthetic users, orders and products with no upload.',
    intro: 'This online test data generator creates synthetic fixture rows in the browser. It is built for QA, local development, demos and docs where you need realistic-looking but non-real data.',
    useCases: [
      'Create local QA fixtures without using real customer records.',
      'Generate JSON, CSV or SQL snippets for documentation.',
      'Seed a demo with users, orders or product rows.',
    ],
    example: {
      input: 'Dataset: users, rows: 3, format: CSV',
      output: 'id,full_name,email,city,status,signup_date\n1,Ada Lovelace,ada.lovelace1@example.com,Austin,active,2026-01-18',
    },
    faq: [
      { q: 'Is generated test data real?', a: 'No. It is synthetic placeholder data for development and QA.' },
      { q: 'Does the tool upload generated rows?', a: 'No. Generation and formatting run in your browser.' },
      { q: 'Which formats are supported?', a: 'The tool exports JSON, CSV and SQL insert statements.' },
    ],
    related: ['mock-data-generator', 'random-csv-generator', 'sql-insert-generator'],
  },
  {
    slug: 'random-csv-generator',
    toolSlug: 'mock-data-generator',
    title: 'Random CSV Generator',
    h1: 'Random CSV Generator',
    description: 'Generate random CSV fixture rows for users, orders and products locally in your browser.',
    intro: 'The random CSV generator creates small synthetic tables that are easy to paste into spreadsheets, tests or import scripts.',
    useCases: [
      'Create a quick CSV sample for parser tests.',
      'Prepare spreadsheet demo data without exposing real records.',
      'Generate import fixtures for local development.',
    ],
    example: {
      input: 'Dataset: orders, rows: 2, format: CSV',
      output: 'id,order_id,customer_email,amount_usd,status,created_at\n1,ORD-10001,customer1@example.com,73.42,paid,2026-02-03',
    },
    faq: [
      { q: 'Can I choose JSON instead?', a: 'Yes. The same Mock Data Generator exports JSON, CSV and SQL.' },
      { q: 'Does it support huge CSV files?', a: 'No. It is intentionally capped for small QA fixtures and examples.' },
      { q: 'Is the data safe to share?', a: 'It is synthetic, but still review output before publishing examples.' },
    ],
    related: ['mock-data-generator', 'json-to-csv', 'test-data-generator-online'],
  },
  {
    slug: 'sql-insert-generator',
    toolSlug: 'mock-data-generator',
    title: 'SQL Insert Generator',
    h1: 'SQL Insert Generator',
    description: 'Generate SQL INSERT fixture statements for users, orders or products locally in your browser.',
    intro: 'The SQL insert generator turns synthetic fixture rows into simple INSERT statements for demos and local test databases.',
    useCases: [
      'Draft seed data for a local database.',
      'Create sample INSERT statements for documentation.',
      'Generate small order or product fixtures without touching production data.',
    ],
    example: {
      input: 'Dataset: products, rows: 1, format: SQL',
      output: "INSERT INTO mock_products (id, sku, name, category, price_usd, active) VALUES (1, 'SKU-0001', 'Starter Plan', 'subscription', 29, TRUE);",
    },
    faq: [
      { q: 'Can I run the SQL directly?', a: 'Review table names, data types and quoting before running generated SQL in any database.' },
      { q: 'Which SQL dialect is targeted?', a: 'The output is simple ANSI-style INSERT statements for fixtures, not dialect-specific migrations.' },
      { q: 'Does SQL generation need a backend?', a: 'No. It runs locally in the browser.' },
    ],
    related: ['mock-data-generator', 'test-data-generator-online', 'uuid-v7-generator-postgres'],
  },
  {
    slug: 'sample-json-generator',
    toolSlug: 'mock-data-generator',
    title: 'Sample JSON Generator',
    h1: 'Sample JSON Generator',
    description: 'Generate sample JSON arrays for users, orders and products. Local synthetic data with no upload.',
    intro: 'The sample JSON generator produces readable JSON arrays for tests, API examples and documentation snippets.',
    useCases: [
      'Create example JSON for docs or bug reports.',
      'Seed frontend states without calling an API.',
      'Build small mock responses for local tests.',
    ],
    example: {
      input: 'Dataset: users, rows: 1, format: JSON',
      output: '[\n  {\n    "id": 1,\n    "full_name": "Ada Lovelace",\n    "email": "ada.lovelace1@example.com"\n  }\n]',
    },
    faq: [
      { q: 'Is this JSON based on a schema?', a: 'No. This first version offers built-in user, order and product fixtures.' },
      { q: 'Can I convert the JSON to CSV?', a: 'Yes. Use the related JSON to CSV tool when you need a table.' },
      { q: 'Does the sample JSON leave my browser?', a: 'No. It is generated locally.' },
    ],
    related: ['mock-data-generator', 'json-to-csv', 'json-formatter'],
  },
  {
    slug: 'mock-user-data-generator',
    toolSlug: 'mock-data-generator',
    title: 'Mock User Data Generator',
    h1: 'Mock User Data Generator',
    description: 'Generate synthetic user rows with names, emails, cities, statuses and dates for QA fixtures.',
    intro: 'Mock user data helps test list views, imports, onboarding screens and CRM demos without using real people or customer records.',
    useCases: [
      'Fill a local users table for UI testing.',
      'Create sample CSV rows for an import flow.',
      'Generate JSON user fixtures for frontend tests.',
    ],
    example: {
      input: 'Dataset: users, rows: 2',
      output: 'full_name,email,city,status\nAda Lovelace,ada.lovelace1@example.com,Austin,active',
    },
    faq: [
      { q: 'Are the names and emails real?', a: 'No. They are synthetic placeholders.' },
      { q: 'Can I export SQL?', a: 'Yes. Choose SQL in the Mock Data Generator.' },
      { q: 'Should I use this for production users?', a: 'No. It is only for development, QA, seed data and demos.' },
    ],
    related: ['mock-data-generator', 'test-data-generator-online', 'sample-json-generator'],
  },
  {
    slug: 'mock-order-data-generator',
    toolSlug: 'mock-data-generator',
    title: 'Mock Order Data Generator',
    h1: 'Mock Order Data Generator',
    description: 'Generate synthetic order rows with IDs, emails, amounts, statuses and dates for local QA.',
    intro: 'Mock order data is useful when testing dashboards, revenue tables, import jobs and demo checkout flows without real transaction records.',
    useCases: [
      'Create order rows for dashboard tests.',
      'Generate CSV import samples for finance or ops views.',
      'Build SQL fixtures for local ecommerce demos.',
    ],
    example: {
      input: 'Dataset: orders, rows: 2',
      output: 'order_id,customer_email,amount_usd,status\nORD-10001,customer1@example.com,73.42,paid',
    },
    faq: [
      { q: 'Are these payment records real?', a: 'No. They are synthetic local fixtures.' },
      { q: 'Can I choose order status values?', a: 'This first version uses built-in example statuses.' },
      { q: 'Does generation call an API?', a: 'No. It runs in the browser.' },
    ],
    related: ['mock-data-generator', 'sql-insert-generator', 'random-csv-generator'],
  },
];

export const SEO_VARIANTS: SeoVariant[] = [
  ...BASE_SEO_VARIANTS,
  ...CRON_PLATFORM_VARIANTS,
  ...UUID_VARIANTS,
  ...MOCK_DATA_VARIANTS,
];

export const SEO_VARIANTS_BY_SLUG = new Map(SEO_VARIANTS.map((variant) => [variant.slug, variant] as const));
