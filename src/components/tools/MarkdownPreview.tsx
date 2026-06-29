import { useMemo, useState } from 'preact/hooks';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Panel } from './_shared';

const SAMPLE = `# inbrowser.sh\n\n**Markdown** preview, _rendered_ in your browser.\n\n- Fast\n- Private\n- No login\n\n\`\`\`js\nconsole.log('hello')\n\`\`\`\n\n[Visit](https://inbrowser.sh)\n`;

marked.setOptions({ gfm: true, breaks: false });

export default function MarkdownPreview() {
  const [src, setSrc] = useState(SAMPLE);

  const html = useMemo(() => {
    const raw = marked.parse(src) as string;
    return DOMPurify.sanitize(raw);
  }, [src]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Markdown">
        <textarea spellcheck={false} value={src} onInput={(e) => setSrc((e.target as HTMLTextAreaElement).value)} aria-label="Markdown source" />
      </Panel>
      <Panel title="Preview">
        <div class="card p-4 prose-tool overflow-auto min-h-[180px]" dangerouslySetInnerHTML={{ __html: html }} />
      </Panel>
    </div>
  );
}
