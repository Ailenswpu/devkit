import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

const SAMPLE = `{"name":"inbrowser.sh","version":"1.0.0","tags":["dev","tools"],"features":{"private":true,"login":false}}`;

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState<2 | 4>(2);
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');

  const { out, error } = useMemo(() => {
    if (!input.trim()) return { out: '', error: '' };
    try {
      const parsed = JSON.parse(input);
      const out = mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      return { out, error: '' };
    } catch (e) {
      return { out: '', error: (e as Error).message };
    }
  }, [input, indent, mode]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel
        title="Input"
        action={<button class="btn btn-ghost text-xs" onClick={() => setInput(SAMPLE)}>Load sample</button>}
        error={error}
      >
        <textarea
          spellcheck={false}
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          aria-label="JSON input"
        />
      </Panel>
      <Panel
        title="Output"
        action={<CopyBtn value={() => out} />}
      >
        <textarea readOnly value={out} aria-label="Formatted output" />
      </Panel>
      <div class="md:col-span-2">
        <Row>
          <Tabs
            tabs={[{ id: 'beautify', label: 'Beautify' }, { id: 'minify', label: 'Minify' }]}
            value={mode}
            onChange={(v) => setMode(v as any)}
          />
          <span class="text-xs text-muted ml-2">Indent</span>
          <Tabs
            tabs={[{ id: '2', label: '2 spaces' }, { id: '4', label: '4 spaces' }]}
            value={String(indent)}
            onChange={(v) => setIndent(Number(v) as 2 | 4)}
          />
          <span class="ml-auto text-xs text-muted">
            {error ? 'Invalid JSON' : input.trim() ? `${input.length} → ${out.length} chars` : 'Paste JSON above'}
          </span>
        </Row>
      </div>
    </div>
  );
}
