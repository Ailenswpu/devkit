import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Tabs } from './_shared';

function words(s: string): string[] {
  return s
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_\-./]+/)
    .filter(Boolean);
}

const cases = {
  camel: (s: string) => words(s).map((w, i) => i ? cap(w.toLowerCase()) : w.toLowerCase()).join(''),
  pascal: (s: string) => words(s).map(w => cap(w.toLowerCase())).join(''),
  snake: (s: string) => words(s).map(w => w.toLowerCase()).join('_'),
  kebab: (s: string) => words(s).map(w => w.toLowerCase()).join('-'),
  constant: (s: string) => words(s).map(w => w.toUpperCase()).join('_'),
  title: (s: string) => words(s).map(w => cap(w.toLowerCase())).join(' '),
  upper: (s: string) => s.toUpperCase(),
  lower: (s: string) => s.toLowerCase(),
};
function cap(s: string) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

const TABS = [
  { id: 'camel', label: 'camelCase' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'constant', label: 'CONSTANT' },
  { id: 'title', label: 'Title Case' },
  { id: 'upper', label: 'UPPER' },
  { id: 'lower', label: 'lower' },
];

export default function CaseConverter() {
  const [input, setInput] = useState('Hello World — inbrowser.sh tools');
  const [mode, setMode] = useState<keyof typeof cases>('camel');

  const out = useMemo(() => input.split('\n').map(line => cases[mode](line)).join('\n'), [input, mode]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Input">
        <textarea spellcheck={false} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} aria-label="Input" />
      </Panel>
      <Panel title="Output" action={<CopyBtn value={() => out} />}>
        <textarea readOnly value={out} aria-label="Output" />
      </Panel>
      <div class="md:col-span-2">
        <Tabs tabs={TABS} value={mode} onChange={(v) => setMode(v as any)} />
      </div>
    </div>
  );
}
