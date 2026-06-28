import { useMemo, useState } from 'preact/hooks';
import { Panel, Row } from './_shared';

const FLAGS: { id: string; label: string }[] = [
  { id: 'g', label: 'g' },
  { id: 'i', label: 'i' },
  { id: 'm', label: 'm' },
  { id: 's', label: 's' },
  { id: 'u', label: 'u' },
];

const MAX_INPUT = 100_000;

export default function RegexTester() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact us at support@inbrowser.sh or support@example.com');

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpExecArray[], err: '' };
    if (text.length > MAX_INPUT) return { matches: [], err: `Input too large (>${MAX_INPUT} chars).` };
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const matches: RegExpExecArray[] = [];
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = re.exec(text)) !== null) {
        matches.push(m);
        if (++guard > 5000) break;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      return { matches, err: '' };
    } catch (e) {
      return { matches: [], err: (e as Error).message };
    }
  }, [pattern, flags, text]);

  function highlight() {
    if (result.matches.length === 0 || result.err) return text;
    const parts: any[] = [];
    let cursor = 0;
    for (const m of result.matches) {
      if (m.index > cursor) parts.push(text.slice(cursor, m.index));
      parts.push(<mark class="bg-accent/30 text-fg rounded px-0.5">{m[0]}</mark>);
      cursor = m.index + m[0].length;
    }
    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  }

  return (
    <div class="grid gap-4">
      <Row>
        <span class="text-muted">/</span>
        <input
          type="text"
          value={pattern}
          onInput={(e) => setPattern((e.target as HTMLInputElement).value)}
          class="flex-1 min-w-[200px]"
          aria-label="Regex pattern"
        />
        <span class="text-muted">/</span>
        <div class="inline-flex gap-1">
          {FLAGS.map(f => {
            const on = flags.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                class={`btn text-xs ${on ? 'btn-primary' : ''}`}
                onClick={() => setFlags(on ? flags.replace(f.id, '') : flags + f.id)}
                aria-pressed={on}
              >{f.label}</button>
            );
          })}
        </div>
      </Row>
      <Panel title="Test string" error={result.err}>
        <textarea
          spellcheck={false}
          value={text}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          aria-label="Test string"
        />
      </Panel>
      <Panel title="Highlighted">
        <div class="card p-3 font-mono text-sm whitespace-pre-wrap break-words min-h-[80px]">{highlight()}</div>
      </Panel>
      <div class="grid gap-2">
        <div class="text-xs text-muted">{result.matches.length} match{result.matches.length === 1 ? '' : 'es'}</div>
        {result.matches.map((m, i) => (
          <div key={i} class="card p-3 text-xs">
            <div class="font-mono">{m[0]}</div>
            {m.length > 1 && (
              <div class="text-muted mt-1">
                {m.slice(1).map((g, gi) => <div>Group {gi + 1}: <code class="text-fg">{g}</code></div>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
