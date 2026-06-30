import { useMemo, useRef, useState } from 'preact/hooks';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Papa from 'papaparse';
import { Copy, Download, FileText, Loader2, UploadCloud, X } from 'lucide-preact';
import { Panel, Row, Tabs } from './_shared';

type OutputMode = 'markdown' | 'preview';

interface Options {
  readability: boolean;
  keepLinks: boolean;
  keepImages: boolean;
  gfmTables: boolean;
  normalizeHeadings: boolean;
  frontMatter: boolean;
}

interface ConversionResult {
  markdown: string;
  title: string;
  kind: string;
  notices: string[];
}

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const CONVERT_TIMEOUT_MS = 30000;

const SAMPLE_HTML = `<article>
  <h1>Convert browser files to Markdown</h1>
  <p>inbrowser.sh keeps file conversion local.</p>
  <ul>
    <li>No upload</li>
    <li>GitHub-flavored tables</li>
  </ul>
</article>`;

const DEFAULT_OPTIONS: Options = {
  readability: true,
  keepLinks: true,
  keepImages: false,
  gfmTables: true,
  normalizeHeadings: true,
  frontMatter: false,
};

const FORMAT_LABELS = ['HTML', 'PDF', 'DOCX', 'XLSX', 'CSV', 'JSON', 'PPTX', 'RSS'];

marked.setOptions({ gfm: true, breaks: false });

export default function ToMarkdown() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceText, setSourceText] = useState(SAMPLE_HTML);
  const [markdown, setMarkdown] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('Paste HTML, JSON, CSV, TSV or choose a document file.');
  const [error, setError] = useState('');
  const [notices, setNotices] = useState<string[]>([]);
  const [outputMode, setOutputMode] = useState<OutputMode>('markdown');
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  const [busy, setBusy] = useState(false);

  const previewHtml = useMemo(() => {
    const raw = marked.parse(markdown || '') as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  async function runTextConversion() {
    await convert(() => convertText(sourceText, options, fileName || 'pasted input'));
  }

  async function handleFiles(files: FileList | File[]) {
    const file = Array.from(files)[0];
    if (!file) return;
    setFileName(file.name);
    await convert(() => convertFile(file, options));
  }

  async function convert(task: () => Promise<ConversionResult>) {
    setBusy(true);
    setError('');
    setNotices([]);
    setStatus('Converting in your browser...');
    try {
      const result = await withTimeout(task(), CONVERT_TIMEOUT_MS);
      setMarkdown(result.markdown);
      setNotices(result.notices);
      setStatus(`${result.kind} converted locally${result.title ? `: ${result.title}` : '.'}`);
      setOutputMode('markdown');
    } catch (e) {
      setError((e as Error).message);
      setStatus('Conversion failed.');
    } finally {
      setBusy(false);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus('Markdown copied.');
    } catch {
      setError('Clipboard access was blocked by the browser.');
    }
  }

  function downloadOutput() {
    if (!markdown) return;
    const base = fileName ? fileName.replace(/\.[^.]+$/, '') : 'converted';
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${base}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setSourceText('');
    setMarkdown('');
    setFileName('');
    setError('');
    setNotices([]);
    setStatus('Paste HTML, JSON, CSV, TSV or choose a document file.');
  }

  function setOption(key: keyof Options, value: boolean) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  return (
    <div class="space-y-4">
      <div
        class="rounded-lg border border-dashed border-accent/35 bg-elevated p-4 transition-colors hover:border-accent/70"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer?.files || []);
        }}
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex items-start gap-3">
            <div class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-accent/35 bg-accent/10 text-accent">
              <UploadCloud size={20} aria-hidden="true" />
            </div>
            <div>
              <div class="font-semibold tracking-tight">Drop a file or paste content</div>
              <div class="mt-1 text-sm text-muted">
                HTML, DOCX, XLSX, CSV, TSV, PPTX, JSON, PDF, RSS, RTF, TXT and Markdown files stay in this browser.
              </div>
              <div class="mt-3 flex flex-wrap gap-1.5">
                {FORMAT_LABELS.map((label) => (
                  <span key={label} class="rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-muted">{label}</span>
                ))}
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn btn-primary" onClick={() => inputRef.current?.click()}>
              <FileText size={16} aria-hidden="true" />
              Choose file
            </button>
            <button type="button" class="btn disabled:cursor-not-allowed disabled:opacity-55" onClick={runTextConversion} disabled={busy}>
              {busy ? <Loader2 class="animate-spin" size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
              Convert pasted text
            </button>
            <button type="button" class="btn btn-ghost" onClick={clearAll}>
              <X size={16} aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          class="sr-only"
          type="file"
          accept=".html,.htm,.docx,.xlsx,.xls,.csv,.tsv,.pptx,.json,.pdf,.xml,.rss,.rtf,.txt,.md,text/html,text/csv,application/json,application/pdf,application/rss+xml"
          onChange={(event) => void handleFiles((event.target as HTMLInputElement).files || [])}
        />
      </div>

      <div class="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Panel
          title="Input"
          action={
            <button type="button" class="btn btn-ghost text-xs" onClick={() => setSourceText(SAMPLE_HTML)}>
              Load sample
            </button>
          }
        >
          <textarea
            spellcheck={false}
            value={sourceText}
            onInput={(event) => setSourceText((event.target as HTMLTextAreaElement).value)}
            onPaste={(event) => {
              const files = event.clipboardData?.files;
              if (files && files.length > 0) {
                event.preventDefault();
                void handleFiles(files);
              }
            }}
            placeholder="Paste HTML, JSON, CSV, TSV, RSS, Markdown or plain text..."
            aria-label="Content to convert to Markdown"
          />
        </Panel>

        <Panel
          title="Markdown output"
          error={error}
          action={
            <div class="flex flex-wrap gap-1">
              <button type="button" class="btn btn-ghost text-xs disabled:cursor-not-allowed disabled:opacity-55" onClick={copyOutput} disabled={!markdown}>
                <Copy size={14} aria-hidden="true" />
                Copy
              </button>
              <button type="button" class="btn btn-ghost text-xs disabled:cursor-not-allowed disabled:opacity-55" onClick={downloadOutput} disabled={!markdown}>
                <Download size={14} aria-hidden="true" />
                Download
              </button>
            </div>
          }
        >
          <div class="mb-2">
            <Tabs
              tabs={[{ id: 'markdown', label: 'Markdown' }, { id: 'preview', label: 'Preview' }]}
              value={outputMode}
              onChange={(value) => setOutputMode(value as OutputMode)}
            />
          </div>
          {outputMode === 'markdown' ? (
            <textarea readOnly value={markdown} placeholder="Converted Markdown appears here." aria-label="Markdown output" />
          ) : (
            <div class="card min-h-[220px] overflow-auto p-4 prose-tool" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
        </Panel>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div class="rounded-lg border border-border bg-surface p-4">
          <div class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Output options</div>
          <div class="grid gap-2 sm:grid-cols-2">
            <Checkbox label="Readable article extraction" checked={options.readability} onChange={(value) => setOption('readability', value)} />
            <Checkbox label="Keep links" checked={options.keepLinks} onChange={(value) => setOption('keepLinks', value)} />
            <Checkbox label="Keep images" checked={options.keepImages} onChange={(value) => setOption('keepImages', value)} />
            <Checkbox label="GFM tables" checked={options.gfmTables} onChange={(value) => setOption('gfmTables', value)} />
            <Checkbox label="Normalize headings" checked={options.normalizeHeadings} onChange={(value) => setOption('normalizeHeadings', value)} />
            <Checkbox label="Add front matter" checked={options.frontMatter} onChange={(value) => setOption('frontMatter', value)} />
          </div>
        </div>

        <div class={`rounded-lg border p-4 ${error ? 'border-red-500/45 bg-red-500/5' : 'border-border bg-surface'}`}>
          <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Status</div>
          <p class={`text-sm ${error ? 'text-red-500' : 'text-muted'}`}>{error || status}</p>
          {fileName && <p class="mt-2 text-xs text-muted">Selected file: {fileName}</p>}
          {notices.length > 0 && (
            <ul class="mt-3 space-y-1 text-xs text-muted">
              {notices.map((notice) => <li key={notice}>{notice}</li>)}
            </ul>
          )}
          <Row>
            <span class="mt-3 inline-flex rounded-md border border-border px-2 py-1 text-xs text-muted">Max file size: 20MB</span>
            <span class="mt-3 inline-flex rounded-md border border-border px-2 py-1 text-xs text-muted">No file upload</span>
          </Row>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label class="flex items-center gap-2 text-sm text-muted">
      <input type="checkbox" checked={checked} onChange={(event) => onChange((event.target as HTMLInputElement).checked)} />
      <span>{label}</span>
    </label>
  );
}

async function convertFile(file: File, options: Options): Promise<ConversionResult> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`Files over ${formatBytes(MAX_FILE_BYTES)} are better handled with a CLI workflow.`);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const mime = file.type.toLowerCase();

  if (mime.startsWith('image/')) {
    throw new Error('Image OCR is not enabled in this release. Use an OCR tool first, then paste the extracted text here.');
  }

  if (ext === 'html' || ext === 'htm' || mime.includes('html')) {
    return convertHtml(await file.text(), options, file.name);
  }
  if (ext === 'docx' || mime.includes('wordprocessingml')) {
    return convertDocx(file, options);
  }
  if (ext === 'xlsx' || ext === 'xls' || mime.includes('spreadsheet')) {
    return convertWorkbook(file, options);
  }
  if (ext === 'csv' || mime.includes('csv')) {
    return convertDelimited(await file.text(), ',', options, file.name, 'CSV');
  }
  if (ext === 'tsv' || mime.includes('tab-separated-values')) {
    return convertDelimited(await file.text(), '\t', options, file.name, 'TSV');
  }
  if (ext === 'pptx' || mime.includes('presentationml')) {
    return convertPptx(file, options);
  }
  if (ext === 'pdf' || mime.includes('pdf')) {
    return convertPdf(file, options);
  }
  if (ext === 'json' || mime.includes('json')) {
    return convertJson(await file.text(), options, file.name);
  }
  if (ext === 'rtf' || mime.includes('rtf')) {
    return finalizeMarkdown(rtfToText(await file.text()), options, { title: file.name, kind: 'RTF', notices: ['RTF conversion extracts plain text and drops rich formatting.'] });
  }
  if (ext === 'md' || ext === 'markdown') {
    return finalizeMarkdown(await file.text(), options, { title: file.name, kind: 'Markdown', notices: [] });
  }
  if (ext === 'xml' || ext === 'rss' || mime.includes('xml')) {
    return convertRss(await file.text(), options, file.name);
  }
  if (mime.startsWith('text/') || ext === 'txt') {
    return finalizeMarkdown(await file.text(), options, { title: file.name, kind: 'Plain text', notices: [] });
  }

  throw new Error('Unsupported file type. Try HTML, DOCX, XLSX, CSV, TSV, PPTX, JSON, PDF, RSS, RTF, TXT or Markdown.');
}

async function convertText(input: string, options: Options, title: string): Promise<ConversionResult> {
  const text = input.trim();
  if (!text) throw new Error('Paste content or choose a file first.');

  if (looksLikeJson(text)) return convertJson(text, options, title);
  if (looksLikeRss(text)) return convertRss(text, options, title);
  if (looksLikeHtml(text)) return convertHtml(text, options, title);
  if (looksLikeDelimited(text, '\t')) return convertDelimited(text, '\t', options, title, 'TSV');
  if (looksLikeDelimited(text, ',')) return convertDelimited(text, ',', options, title, 'CSV');
  return finalizeMarkdown(input, options, { title, kind: 'Plain text', notices: [] });
}

async function convertRss(text: string, options: Options, title: string): Promise<ConversionResult> {
  const { XMLParser } = await import('fast-xml-parser');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const parsed = parser.parse(text) as { rss?: { channel?: unknown }; feed?: unknown };
  const channel = isPlainObject(parsed.rss?.channel) ? parsed.rss.channel : null;
  const feed = isPlainObject(parsed.feed) ? parsed.feed : null;

  if (!channel && !feed) throw new Error('This XML does not look like RSS or Atom feed content.');

  const feedTitle = stringValue(channel?.title || feed?.title || title);
  const rawItems = channel ? channel.item : feed?.entry;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
  const lines = [`# ${feedTitle}`, ''];

  for (const item of items) {
    if (!isPlainObject(item)) continue;
    const itemTitle = stringValue(item.title || 'Untitled item');
    const link = rssLink(item.link);
    const description = stripHtml(stringValue(item.description || item.summary || item.content || ''));
    lines.push(`## ${itemTitle}`);
    if (link) lines.push('', link);
    if (description) lines.push('', description);
    lines.push('');
  }

  return finalizeMarkdown(lines.join('\n'), options, { title: feedTitle, kind: 'RSS', notices: [] });
}

async function convertHtml(html: string, options: Options, title: string): Promise<ConversionResult> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  let htmlToConvert = doc.body?.innerHTML || html;
  let resolvedTitle = doc.querySelector('title')?.textContent?.trim() || title;
  const notices: string[] = [];

  if (options.readability) {
    try {
      const { Readability } = await import('@mozilla/readability');
      const article = new Readability(doc.cloneNode(true) as Document).parse();
      if (article?.content) {
        htmlToConvert = article.content;
        resolvedTitle = article.title || resolvedTitle;
      } else {
        notices.push('Readable article extraction found no main article, so the full HTML body was converted.');
      }
    } catch {
      notices.push('Readable article extraction failed, so the full HTML body was converted.');
    }
  }

  const service = await createTurndown(options);
  const markdown = service.turndown(htmlToConvert);
  return finalizeMarkdown(markdown, options, { title: resolvedTitle, kind: 'HTML', notices });
}

async function convertDocx(file: File, options: Options): Promise<ConversionResult> {
  const mammoth = await import('mammoth');
  const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  const converted = await convertHtml(result.value, { ...options, readability: false }, file.name);
  return {
    ...converted,
    title: file.name,
    kind: 'DOCX',
    notices: [...result.messages.map((message) => message.message), ...converted.notices],
  };
}

async function convertWorkbook(file: File, options: Options): Promise<ConversionResult> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sections = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false, defval: '' });
    return `## ${sheetName}\n\n${rowsToMarkdownTable(rows)}`;
  });

  return finalizeMarkdown(sections.join('\n\n'), options, { title: file.name, kind: 'Workbook', notices: [] });
}

function convertDelimited(text: string, delimiter: ',' | '\t', options: Options, title: string, kind: string): ConversionResult {
  const parsed = Papa.parse<string[]>(text, { delimiter, skipEmptyLines: true });
  if (parsed.errors.length > 0) throw new Error(parsed.errors[0].message);
  const rows = parsed.data.filter((row) => row.some((cell) => String(cell).trim()));
  return finalizeMarkdown(rowsToMarkdownTable(rows), options, { title, kind, notices: [] });
}

async function convertPptx(file: File, options: Options): Promise<ConversionResult> {
  const [{ default: JSZip }, { XMLParser }] = await Promise.all([import('jszip'), import('fast-xml-parser')]);
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const parser = new XMLParser({ ignoreAttributes: false });
  const slideFiles = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => slideNumber(a) - slideNumber(b));

  if (slideFiles.length === 0) throw new Error('No slides were found in this PPTX file.');

  const sections: string[] = [];
  for (const path of slideFiles) {
    const xml = await zip.files[path].async('text');
    const parsed = parser.parse(xml);
    const texts = collectXmlText(parsed).map((item) => item.trim()).filter(Boolean);
    sections.push(`## Slide ${slideNumber(path)}\n\n${texts.join('\n\n') || '_No extractable text found._'}`);
  }

  return finalizeMarkdown(sections.join('\n\n'), options, {
    title: file.name,
    kind: 'PPTX',
    notices: ['PPTX conversion extracts slide text only. Layout, speaker notes and images may be lost.'],
  });
}

async function convertPdf(file: File, options: Options): Promise<ConversionResult> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await task.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(`## Page ${pageNumber}\n\n${pdfItemsToText(content.items)}`);
  }

  return finalizeMarkdown(pages.join('\n\n'), options, {
    title: file.name,
    kind: 'PDF',
    notices: ['PDF conversion is text-only and best-effort. Tables, columns and layout can be lossy.'],
  });
}

function convertJson(text: string, options: Options, title: string): ConversionResult {
  const parsed = JSON.parse(text);
  let markdown = '';
  if (Array.isArray(parsed) && parsed.every(isPlainObject)) {
    markdown = rowsToMarkdownTable(objectsToRows(parsed as Record<string, unknown>[]));
  } else {
    markdown = `\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\``;
  }
  return finalizeMarkdown(markdown, options, { title, kind: 'JSON', notices: [] });
}

async function createTurndown(options: Options) {
  const [{ default: TurndownService }, { gfm }] = await Promise.all([import('turndown'), import('turndown-plugin-gfm')]);
  const service = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  if (options.gfmTables) service.use(gfm);
  if (!options.keepLinks) {
    service.addRule('removeLinks', {
      filter: 'a',
      replacement: (content) => content,
    });
  }
  if (!options.keepImages) {
    service.addRule('removeImages', {
      filter: 'img',
      replacement: (_content, node) => {
        const alt = (node as HTMLElement).getAttribute('alt')?.trim();
        return alt ? alt : '';
      },
    });
  }

  return service;
}

function finalizeMarkdown(markdown: string, options: Options, meta: { title: string; kind: string; notices: string[] }): ConversionResult {
  let output = markdown.trim();
  if (options.normalizeHeadings) output = normalizeHeadings(output);
  if (options.frontMatter) {
    output = `---\ntitle: "${escapeYaml(meta.title)}"\nconverted: "${new Date().toISOString()}"\n---\n\n${output}`;
  }

  return {
    markdown: output ? `${output}\n` : '',
    title: meta.title,
    kind: meta.kind,
    notices: meta.notices.filter(Boolean),
  };
}

function rowsToMarkdownTable(rows: unknown[][]): string {
  if (rows.length === 0) return '_No rows found._';
  const width = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) => Array.from({ length: width }, (_value, index) => cleanCell(row[index])));
  const header = normalized[0].map((cell, index) => cell || `Column ${index + 1}`);
  const body = normalized.slice(1);
  return [
    markdownTableRow(header),
    markdownTableRow(header.map(() => '---')),
    ...body.map(markdownTableRow),
  ].join('\n');
}

function objectsToRows(items: Record<string, unknown>[]): unknown[][] {
  const keys = Array.from(new Set(items.flatMap((item) => Object.keys(item))));
  return [keys, ...items.map((item) => keys.map((key) => formatJsonCell(item[key])))];
}

function markdownTableRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

function cleanCell(value: unknown): string {
  return String(value ?? '')
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|')
    .trim();
}

function formatJsonCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function normalizeHeadings(markdown: string): string {
  const matches = Array.from(markdown.matchAll(/^(#{1,6})\s+/gm));
  if (matches.length === 0) return markdown;
  const minDepth = Math.min(...matches.map((match) => match[1].length));
  return markdown.replace(/^(#{1,6})\s+/gm, (match, hashes: string) => {
    const depth = Math.min(6, Math.max(1, hashes.length - minDepth + 1));
    return `${'#'.repeat(depth)} `;
  });
}

function pdfItemsToText(items: unknown[]): string {
  const lines: string[] = [];
  let current = '';
  let lastY: number | null = null;

  for (const item of items) {
    if (!isPdfTextItem(item)) continue;
    const y = Number(item.transform?.[5] ?? 0);
    const text = item.str.trim();
    if (!text) continue;
    if (lastY !== null && Math.abs(y - lastY) > 4) {
      if (current.trim()) lines.push(current.trim());
      current = text;
    } else {
      current = current ? `${current} ${text}` : text;
    }
    lastY = y;
  }

  if (current.trim()) lines.push(current.trim());
  return lines.join('\n\n');
}

function isPdfTextItem(item: unknown): item is { str: string; transform?: number[] } {
  return typeof item === 'object' && item !== null && 'str' in item && typeof (item as { str?: unknown }).str === 'string';
}

function collectXmlText(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectXmlText);
  if (typeof value !== 'object' || value === null) return [];

  const out: string[] = [];
  for (const [key, child] of Object.entries(value)) {
    if (key === 'a:t') out.push(...collectStringLeaves(child));
    else out.push(...collectXmlText(child));
  }
  return out;
}

function collectStringLeaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStringLeaves);
  if (typeof value === 'object' && value !== null) return Object.values(value).flatMap(collectStringLeaves);
  return [];
}

function rtfToText(input: string): string {
  return input
    .replace(/\\par[d]?/g, '\n')
    .replace(/\\'[0-9a-fA-F]{2}/g, '')
    .replace(/[{}]/g, '')
    .replace(/\\[a-zA-Z]+\d* ?/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function looksLikeJson(text: string): boolean {
  if (!/^[\[{]/.test(text)) return false;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function looksLikeHtml(text: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(text);
}

function looksLikeRss(text: string): boolean {
  return /<(rss|feed)\b/i.test(text);
}

function looksLikeDelimited(text: string, delimiter: ',' | '\t'): boolean {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return false;
  return lines.slice(0, 3).every((line) => line.includes(delimiter));
}

function slideNumber(path: string): number {
  return Number(path.match(/slide(\d+)\.xml$/)?.[1] || 0);
}

function escapeYaml(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function rssLink(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return rssLink(value[0]);
  if (isPlainObject(value)) return stringValue(value['@_href'] || value.href || value['#text']);
  return '';
}

function stringValue(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (isPlainObject(value)) return stringValue(value['#text']);
  return '';
}

function stripHtml(value: string): string {
  if (!value) return '';
  const parser = new DOMParser();
  return parser.parseFromString(value, 'text/html').body.textContent?.trim() || value;
}

function formatBytes(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<T>((_resolve, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('Conversion took too long. Try a smaller file or a CLI workflow.')), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
