import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

export default function UrlEncode() {
  const [input, setInput] = useState('hello world?q=inbrowser&page=1');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const { out, error } = useMemo(() => {
    try {
      return { out: mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input), error: '' };
    } catch (e) {
      return { out: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Input">
        <textarea spellcheck={false} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} aria-label="Input" />
      </Panel>
      <Panel title="Output" action={<CopyBtn value={() => out} />} error={error}>
        <textarea readOnly value={out} aria-label="Output" />
      </Panel>
      <div class="md:col-span-2">
        <Tabs tabs={[{ id: 'encode', label: 'Encode' }, { id: 'decode', label: 'Decode' }]} value={mode} onChange={(v) => setMode(v as any)} />
      </div>
    </div>
  );
}
