import { useEffect, useState } from 'preact/hooks';
import SparkMD5 from 'spark-md5';
import { CopyBtn, Panel } from './_shared';

const ALGOS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algo = typeof ALGOS[number];

async function digest(algo: Algo, input: string): Promise<string> {
  if (algo === 'MD5') return SparkMD5.hash(input);
  const buf = new TextEncoder().encode(input);
  const h = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('Hello, DevKit!');
  const [hashes, setHashes] = useState<Record<Algo, string>>({} as any);

  useEffect(() => {
    let cancelled = false;
    Promise.all(ALGOS.map(a => digest(a, input).then(d => [a, d] as const))).then(rows => {
      if (cancelled) return;
      const next = Object.fromEntries(rows) as Record<Algo, string>;
      setHashes(next);
    });
    return () => { cancelled = true; };
  }, [input]);

  return (
    <div class="grid gap-4">
      <Panel title="Input">
        <textarea
          spellcheck={false}
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          aria-label="Text to hash"
        />
      </Panel>
      <div class="grid gap-2">
        {ALGOS.map(a => (
          <div class="card p-3 flex items-center gap-3" key={a}>
            <div class="text-xs font-semibold uppercase w-20 text-muted">{a}</div>
            <code class="font-mono text-xs break-all flex-1">{hashes[a] || '…'}</code>
            <CopyBtn value={() => hashes[a] || ''} />
          </div>
        ))}
      </div>
    </div>
  );
}
