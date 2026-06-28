export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
  intro: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-client-side-developer-tools-are-safer',
    title: 'Why client-side developer tools are safer for everyday debugging',
    description:
      'A practical guide to when browser-only JSON, Base64, JWT and text tools are safer than upload-based utilities.',
    date: '2026-06-28',
    category: 'Privacy',
    readingTime: '5 min read',
    intro:
      'Developer tools often handle data that is not meant to become public: API responses, JWT payloads, staging URLs, internal IDs, configuration snippets and draft documentation. A client-side tool does not automatically solve every privacy problem, but it removes one of the biggest risks: sending the input to a server you do not control.',
    sections: [
      {
        heading: 'The hidden risk in simple paste-and-convert workflows',
        paragraphs: [
          'Small utilities feel harmless because the task is small. Formatting JSON, decoding Base64, converting Markdown, generating a QR code or testing a regex usually takes only a few seconds. That is exactly why it is easy to forget what is inside the clipboard.',
          'A copied API response can contain customer identifiers. A decoded JWT can reveal account IDs, scopes or environment names. A QR code payload might include an internal URL. If a tool uploads that data for processing, the user has to trust the site operator, the hosting provider, logs, analytics and any third-party scripts on the page.',
        ],
      },
      {
        heading: 'What client-side processing changes',
        paragraphs: [
          'When a tool runs in the browser, the conversion logic executes on the user device. For tasks like JSON parsing, hashing text, URL encoding, line sorting, case conversion or Markdown preview, there is no technical need to send the input to a backend.',
          'This model is especially useful for quick inspection. A developer can paste a payload, understand it, copy the result and close the tab without creating an account or storing a history on a remote service.',
        ],
        bullets: [
          'Less data leaves the machine during routine formatting and conversion.',
          'The tool remains fast because there is no round trip for simple transformations.',
          'The user can inspect network activity and confirm that the input is not posted to an API.',
          'Static pages remain readable even if JavaScript fails, which helps both users and crawlers.',
        ],
      },
      {
        heading: 'Client-side does not mean careless',
        paragraphs: [
          'A browser-only tool still needs careful implementation. It should avoid unnecessary third-party scripts near sensitive workflows, label advertising clearly, keep copy buttons separate from ads, and explain whether analytics or ad scripts are present on the page.',
          'Users should also avoid pasting production secrets into any web page unless they understand the risk. For highly sensitive material, local command-line tools and offline workflows are still the safest option.',
        ],
      },
      {
        heading: 'A practical rule for choosing a tool',
        paragraphs: [
          'Use client-side web tools for low-risk inspection, formatting and conversion. Use local scripts or approved internal tools for production credentials, private keys, regulated data and anything that would require incident response if it leaked.',
          'The best everyday tool is honest about this boundary. It should make common work faster without pretending to replace a security review.',
        ],
      },
    ],
  },
  {
    slug: 'json-formatting-checklist-before-sharing-api-data',
    title: 'A JSON formatting checklist before sharing API data',
    description:
      'How to clean, inspect and safely share JSON examples in bug reports, documentation and support tickets.',
    date: '2026-06-27',
    category: 'JSON',
    readingTime: '6 min read',
    intro:
      'JSON is easy to copy and surprisingly easy to overshare. Before pasting an API response into a ticket, docs page or chat thread, it is worth taking a minute to format it, remove sensitive fields and verify that the remaining sample still demonstrates the issue.',
    sections: [
      {
        heading: 'Start with formatting, not editing',
        paragraphs: [
          'Pretty-print the JSON first. Indentation reveals the shape of the object: which fields are nested, which arrays are long, and which values are repeated. Editing minified JSON by hand is where accidental deletions and invalid commas happen.',
          'After formatting, check whether the top-level value is an object or an array. This matters when another person tries to reproduce the problem in a parser, a database import or a test fixture.',
        ],
      },
      {
        heading: 'Redact fields deliberately',
        paragraphs: [
          'Redaction is more than replacing obvious secrets. A safe example should remove or alter any value that can identify a person, account, organization, private infrastructure or paid service.',
        ],
        bullets: [
          'Replace tokens, API keys, session IDs and authorization headers.',
          'Change emails, names, phone numbers, addresses and customer IDs.',
          'Remove internal hostnames, private URLs and database identifiers.',
          'Keep field names when they are needed to explain the schema, but replace values with realistic placeholders.',
        ],
      },
      {
        heading: 'Keep enough structure to reproduce the issue',
        paragraphs: [
          'Over-redaction can make a bug report useless. If the issue depends on a nested array, keep two or three representative items. If it depends on a null value, leave a null value in the sample. If it depends on date formatting, keep the date format but change the actual date.',
          'The goal is not to make the data meaningless. The goal is to make it safe while preserving the shape that triggered the bug.',
        ],
      },
      {
        heading: 'Validate after every edit',
        paragraphs: [
          'After redacting, run the JSON through a validator again. The most common mistakes are trailing commas, missing quotes, unescaped line breaks and comments copied from JavaScript objects. Strict JSON does not allow comments or trailing commas.',
          'If the sample is going into documentation, also minify it once and parse it again. This catches invisible characters and confirms that the example can be consumed by machines.',
        ],
      },
      {
        heading: 'Add context next to the sample',
        paragraphs: [
          'A clean JSON sample is strongest when paired with a short note: what endpoint produced it, what field is surprising, what output was expected and what output was observed. This saves reviewers from guessing and makes the sample useful long after the original conversation.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-debug-jwt-payloads-without-leaking-secrets',
    title: 'How to debug JWT payloads without leaking secrets',
    description:
      'A practical workflow for inspecting JWT headers and claims while avoiding accidental exposure of production tokens.',
    date: '2026-06-26',
    category: 'Security',
    readingTime: '5 min read',
    intro:
      'JWTs are convenient because they carry structured claims in a compact string. They are also easy to mishandle. A token copied into a chat, ticket or random decoder may contain account identifiers, scopes, tenant names and expiry details. Debugging a JWT safely means separating what you need to inspect from what you should never share.',
    sections: [
      {
        heading: 'Remember that decoding is not verification',
        paragraphs: [
          'A JWT decoder can split the token into header, payload and signature, then base64url-decode the JSON sections. That is useful for reading claims, but it does not prove that the token is valid. Signature verification requires the issuer key and the expected algorithm.',
          'This distinction matters in bug reports. Saying “the JWT decodes correctly” only means the token is syntactically readable. It does not mean the token should be accepted by an API.',
        ],
      },
      {
        heading: 'Inspect claims before sharing anything',
        paragraphs: [
          'The payload often contains fields that identify a user, workspace, plan, organization or environment. Even when the token is expired, those claims may still be sensitive. Read the payload locally first and decide which fields are needed to explain the issue.',
        ],
        bullets: [
          'Check `exp`, `nbf` and `iat` to understand time-based failures.',
          'Check `iss` and `aud` when an API rejects a token from the wrong issuer or audience.',
          'Check scopes and roles when authorization fails after authentication succeeds.',
          'Replace `sub`, tenant IDs, emails and internal names before posting examples.',
        ],
      },
      {
        heading: 'Use synthetic tokens in documentation',
        paragraphs: [
          'Docs and support articles rarely need real tokens. Create a synthetic header and payload that show the relevant claim names, then use a placeholder signature. Readers can understand the shape without seeing production values.',
          'If the bug depends on a precise timestamp or scope value, keep the format and change the content. For example, use a future-looking example timestamp rather than one copied from a live customer token.',
        ],
      },
      {
        heading: 'Avoid pasting bearer tokens into external tools',
        paragraphs: [
          'A bearer token is effectively a password until it expires or is revoked. If it grants access to a production API, treat it as a secret. Prefer local tooling, internal approved utilities or a browser-only decoder that you can inspect with the network panel.',
          'If a production token was pasted into a place you do not control, rotate it. The safest token is the one that no longer works.',
        ],
      },
      {
        heading: 'A safe JWT debugging checklist',
        bullets: [
          'Decode locally first and identify only the claims needed for the discussion.',
          'Never share a live signature or full bearer token in a public issue.',
          'Redact user, organization, tenant and environment identifiers.',
          'State whether the problem is parsing, expiry, audience, issuer or authorization scope.',
          'Rotate any token that may have been exposed outside approved systems.',
        ],
      },
    ],
  },
  {
    slug: 'choosing-the-right-identifier-uuid-ulid-nanoid',
    title: 'Choosing the right identifier: UUID v4, UUID v7, ULID or NanoID',
    description:
      'A practical comparison of UUID v4, UUID v7, ULID and NanoID for databases, URLs, logs and distributed systems.',
    date: '2026-06-25',
    category: 'Generators',
    readingTime: '6 min read',
    intro:
      'Identifier formats look interchangeable until they appear in a database index, a URL, a log line or a support ticket. UUID v4, UUID v7, ULID and NanoID can all be good choices, but they optimize for different tradeoffs.',
    sections: [
      {
        heading: 'UUID v4: boring, random and widely supported',
        paragraphs: [
          'UUID v4 is the default choice for many systems because it is random, familiar and supported almost everywhere. It does not reveal creation time and it is easy to generate independently across services.',
          'The tradeoff is database locality. Purely random values can scatter inserts across an index, which may increase write amplification in large tables. For small and medium projects, this may never matter. For high-write tables, it can become noticeable.',
        ],
      },
      {
        heading: 'UUID v7: time-ordered without giving up UUID compatibility',
        paragraphs: [
          'UUID v7 adds a timestamp-based prefix while keeping the UUID shape. That makes IDs roughly sortable by creation time and friendlier to database indexes than v4. It is a strong default for new systems that want UUID compatibility and better insertion locality.',
          'Because v7 includes time information, it may reveal when a record was created. That is usually fine for internal database IDs, but it may matter for public URLs or privacy-sensitive workflows.',
        ],
      },
      {
        heading: 'ULID: readable, sortable and copy-friendly',
        paragraphs: [
          'ULID is also time-sortable and uses a compact Crockford Base32 representation. It is easier to read aloud than a UUID and often looks cleaner in logs or admin screens.',
          'The main downside is ecosystem support. UUIDs are built into more databases, ORMs and validation libraries. ULID works well when the application owns the format and the team wants sortable IDs with shorter strings.',
        ],
      },
      {
        heading: 'NanoID: short IDs for URLs and product surfaces',
        paragraphs: [
          'NanoID is useful when the ID appears directly in a URL, invite code, share link or UI element. It can be much shorter than a UUID while keeping collision risk low when configured correctly.',
          'Length matters. A very short NanoID may be fine for temporary UI state but risky for permanent records. Choose length based on expected volume, lifetime and the cost of a collision.',
        ],
      },
      {
        heading: 'A simple decision guide',
        bullets: [
          'Use UUID v4 when compatibility and randomness matter more than ordering.',
          'Use UUID v7 for new database records that benefit from time ordering.',
          'Use ULID when readable, sortable IDs are useful in logs or admin tools.',
          'Use NanoID for short public IDs, invite links and user-facing tokens.',
          'Avoid exposing any identifier if sequential timing or record volume is sensitive.',
        ],
      },
    ],
  },
  {
    slug: 'markdown-preview-safety-for-documentation-workflows',
    title: 'Markdown preview safety for documentation workflows',
    description:
      'How to preview Markdown for READMEs, docs and support replies without introducing unsafe HTML or broken formatting.',
    date: '2026-06-24',
    category: 'Markdown',
    readingTime: '5 min read',
    intro:
      'Markdown is the working language of READMEs, changelogs, issue templates and internal runbooks. A live preview helps catch formatting mistakes early, but documentation workflows also need a safety check: Markdown can contain links, raw HTML, code blocks and copied snippets that deserve review before publishing.',
    sections: [
      {
        heading: 'Preview structure before polishing words',
        paragraphs: [
          'A Markdown preview is most useful before the text feels finished. Headings, lists, code fences and tables are easier to fix while the document is still flexible. If the preview looks visually confusing, readers will struggle even if the words are accurate.',
          'Start by checking heading hierarchy. A page should have a clear title, then sections that can be scanned. Deeply nested headings often signal that the article needs to be split or simplified.',
        ],
      },
      {
        heading: 'Treat raw HTML as a special case',
        paragraphs: [
          'Many Markdown renderers allow raw HTML. That can be useful for details blocks or custom anchors, but it also increases risk when content is copied from unknown sources. A safe preview pipeline should sanitize rendered HTML before displaying it.',
          'Sanitization does not replace editorial review. It is a safety net that reduces the chance of accidentally rendering scripts, event handlers or unsafe attributes in a preview surface.',
        ],
      },
      {
        heading: 'Check links like code',
        paragraphs: [
          'Documentation links are part of the product experience. A broken link wastes reader time; a misleading link can send people to the wrong command, outdated API or unrelated vendor page. Previewing Markdown should include a quick scan of visible link text and destination URLs.',
        ],
        bullets: [
          'Use descriptive link text instead of “click here”.',
          'Avoid linking sensitive internal URLs in public documentation.',
          'Check that copied issue links do not include private workspace paths.',
          'Prefer canonical docs URLs for product and API references.',
        ],
      },
      {
        heading: 'Make code blocks copyable and complete',
        paragraphs: [
          'Code fences should include enough context for a reader to understand the language and expected environment. A command without the working directory, required variable or input file can be more confusing than no example at all.',
          'Before publishing, copy the command out of the preview and read it as a user would. If it contains a token, private hostname or machine-specific path, replace it with a placeholder.',
        ],
      },
      {
        heading: 'A quick publishing checklist',
        bullets: [
          'Confirm headings form a readable outline.',
          'Preview tables on narrow screens before publishing.',
          'Sanitize rendered HTML when previewing untrusted Markdown.',
          'Review every link destination, not only the visible text.',
          'Remove private paths, tokens and internal hostnames from code blocks.',
        ],
      },
    ],
  },
];

export const BLOG_POSTS_BY_SLUG = new Map(BLOG_POSTS.map((post) => [post.slug, post] as const));

export function getBlogPost(slug: string): BlogPost {
  const post = BLOG_POSTS_BY_SLUG.get(slug);
  if (!post) throw new Error(`Unknown blog slug: ${slug}`);
  return post;
}
