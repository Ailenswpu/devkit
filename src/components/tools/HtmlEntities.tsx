import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

const ENCODE_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const DECODE_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function fromCodePoint(value: number, fallback: string) {
  try {
    return String.fromCodePoint(value);
  } catch {
    return fallback;
  }
}

function encode(s: string) {
  return s.replace(/[&<>"']/g, (c) => ENCODE_ENTITIES[c]);
}
function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (match, n: string) => fromCodePoint(Number(n), match))
    .replace(/&#x([0-9a-f]+);/gi, (match, n: string) => fromCodePoint(parseInt(n, 16), match))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (match, n: string) => DECODE_ENTITIES[n] || match);
}

export default function HtmlEntities() {
  const [input, setInput] = useState('<div class="hi">Hello & welcome</div>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const out = useMemo(() => mode === 'encode' ? encode(input) : decode(input), [input, mode]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Input">
        <textarea spellcheck={false} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} aria-label="Input" />
      </Panel>
      <Panel title="Output" action={<CopyBtn value={() => out} />}>
        <textarea readOnly value={out} aria-label="Output" />
      </Panel>
      <div class="md:col-span-2">
        <Tabs tabs={[{ id: 'encode', label: 'Encode' }, { id: 'decode', label: 'Decode' }]} value={mode} onChange={(v) => setMode(v as any)} />
      </div>
    </div>
  );
}
