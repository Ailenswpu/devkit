import { useMemo, useState } from 'preact/hooks';
import { diffWords } from 'diff';
import { Panel } from './_shared';

export default function TextDiff() {
  const [a, setA] = useState('The quick brown fox jumps over the lazy dog.');
  const [b, setB] = useState('The quick brown cat jumps over the sleepy dog!');

  const parts = useMemo(() => diffWords(a, b), [a, b]);

  return (
    <div class="grid gap-4">
      <div class="grid gap-4 md:grid-cols-2">
        <Panel title="Original">
          <textarea spellcheck={false} value={a} onInput={(e) => setA((e.target as HTMLTextAreaElement).value)} aria-label="Original" />
        </Panel>
        <Panel title="Changed">
          <textarea spellcheck={false} value={b} onInput={(e) => setB((e.target as HTMLTextAreaElement).value)} aria-label="Changed" />
        </Panel>
      </div>
      <Panel title="Diff">
        <div class="card p-3 font-mono text-sm whitespace-pre-wrap break-words leading-6">
          {parts.map((p, i) => (
            p.added ? <span key={i} class="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded px-0.5">{p.value}</span>
            : p.removed ? <span key={i} class="bg-red-500/20 text-red-700 dark:text-red-300 line-through rounded px-0.5">{p.value}</span>
            : <span key={i}>{p.value}</span>
          ))}
        </div>
      </Panel>
    </div>
  );
}
