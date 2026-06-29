import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

function bytesToBinary(bytes: Uint8Array) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return binary;
}

function encode(str: string, urlSafe: boolean) {
  const b = btoa(bytesToBinary(new TextEncoder().encode(str)));
  return urlSafe ? b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b;
}
function decode(str: string, urlSafe: boolean) {
  let s = str.trim();
  if (urlSafe) s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bytes = Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64Tool() {
  const [input, setInput] = useState('Hello, inbrowser.sh!');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);

  const { out, error } = useMemo(() => {
    if (!input) return { out: '', error: '' };
    try {
      return { out: mode === 'encode' ? encode(input, urlSafe) : decode(input, urlSafe), error: '' };
    } catch (e) {
      return { out: '', error: (e as Error).message };
    }
  }, [input, mode, urlSafe]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title={mode === 'encode' ? 'Plain text' : 'Base64'} error={mode === 'decode' ? error : ''}>
        <textarea
          spellcheck={false}
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          aria-label="Input"
        />
      </Panel>
      <Panel title={mode === 'encode' ? 'Base64' : 'Plain text'} action={<CopyBtn value={() => out} />}>
        <textarea readOnly value={out} aria-label="Output" />
      </Panel>
      <div class="md:col-span-2">
        <Row>
          <Tabs
            tabs={[{ id: 'encode', label: 'Encode' }, { id: 'decode', label: 'Decode' }]}
            value={mode}
            onChange={(v) => setMode(v as any)}
          />
          <label class="text-xs text-muted inline-flex items-center gap-1.5 ml-2">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe((e.target as HTMLInputElement).checked)} />
            URL-safe
          </label>
        </Row>
      </div>
    </div>
  );
}
