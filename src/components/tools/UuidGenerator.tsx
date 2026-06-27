import { useState } from 'preact/hooks';
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { ulid } from 'ulid';
import { nanoid } from 'nanoid';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

type Format = 'uuidv4' | 'uuidv7' | 'ulid' | 'nanoid';

function generate(format: Format, count: number, nanoSize: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    if (format === 'uuidv4') out.push(uuidv4());
    else if (format === 'uuidv7') out.push(uuidv7());
    else if (format === 'ulid') out.push(ulid());
    else out.push(nanoid(nanoSize));
  }
  return out;
}

function clampNumber(value: string, min: number, max: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export default function UuidGenerator() {
  const [format, setFormat] = useState<Format>('uuidv4');
  const [count, setCount] = useState(10);
  const [size, setSize] = useState(21);
  const [values, setValues] = useState<string[]>(generate('uuidv4', 10, 21));

  function regen(f: Format = format, c = count, s = size) {
    setValues(generate(f, c, s));
  }

  return (
    <div class="grid gap-4">
      <Row>
        <Tabs
          tabs={[
            { id: 'uuidv4', label: 'UUID v4' },
            { id: 'uuidv7', label: 'UUID v7' },
            { id: 'ulid', label: 'ULID' },
            { id: 'nanoid', label: 'NanoID' },
          ]}
          value={format}
          onChange={(v) => { setFormat(v as Format); regen(v as Format); }}
        />
        <label class="text-xs text-muted">Count
          <input type="number" min={1} max={500} value={count} class="ml-2 w-20" onInput={(e) => setCount(clampNumber((e.target as HTMLInputElement).value, 1, 500))} />
        </label>
        {format === 'nanoid' && (
          <label class="text-xs text-muted">Size
            <input type="number" min={4} max={64} value={size} class="ml-2 w-20" onInput={(e) => setSize(clampNumber((e.target as HTMLInputElement).value, 4, 64))} />
          </label>
        )}
        <button class="btn btn-primary ml-auto" onClick={() => regen()}>Generate</button>
      </Row>
      <Panel title="Output" action={<CopyBtn value={() => values.join('\n')} />}>
        <textarea readOnly class="!min-h-[260px]" value={values.join('\n')} aria-label="Generated IDs" />
      </Panel>
    </div>
  );
}
