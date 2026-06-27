import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

let seed = 1;
function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }

function makeSentence() {
  const len = 6 + Math.floor(rand() * 10);
  const ws: string[] = [];
  for (let i = 0; i < len; i++) ws.push(pick(WORDS));
  let s = ws.join(' ');
  s = s[0].toUpperCase() + s.slice(1) + '.';
  return s;
}
function makeParagraph() {
  const n = 3 + Math.floor(rand() * 5);
  return Array.from({ length: n }, makeSentence).join(' ');
}

type Unit = 'paragraphs' | 'sentences' | 'words';

function clampCount(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(200, Math.trunc(n)));
}

export default function LoremIpsum() {
  const [unit, setUnit] = useState<Unit>('paragraphs');
  const [count, setCount] = useState(3);
  const [tick, setTick] = useState(0);

  const out = useMemo(() => {
    seed = 1 + tick; // deterministic per generation, regen on click
    if (unit === 'words') {
      const ws: string[] = [];
      for (let i = 0; i < count; i++) ws.push(pick(WORDS));
      ws[0] = ws[0][0].toUpperCase() + ws[0].slice(1);
      return ws.join(' ') + '.';
    }
    if (unit === 'sentences') return Array.from({ length: count }, makeSentence).join(' ');
    return Array.from({ length: count }, makeParagraph).join('\n\n');
  }, [unit, count, tick]);

  return (
    <div class="grid gap-4">
      <Row>
        <Tabs tabs={[{ id: 'paragraphs', label: 'Paragraphs' }, { id: 'sentences', label: 'Sentences' }, { id: 'words', label: 'Words' }]} value={unit} onChange={(v) => setUnit(v as Unit)} />
        <label class="text-xs text-muted">Count
          <input type="number" min={1} max={200} value={count} class="ml-2 w-24" onInput={(e) => setCount(clampCount((e.target as HTMLInputElement).value))} />
        </label>
        <button class="btn btn-primary ml-auto" onClick={() => setTick(t => t + 1)}>Generate</button>
      </Row>
      <Panel title="Output" action={<CopyBtn value={() => out} />}>
        <textarea readOnly class="!min-h-[260px]" value={out} aria-label="Generated text" />
      </Panel>
    </div>
  );
}
