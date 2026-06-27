import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel, Row } from './_shared';

export default function LineTools() {
  const [input, setInput] = useState('banana\napple\nbanana\n\ncherry\napple\nDate');
  const [trim, setTrim] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(true);
  const [dedupe, setDedupe] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('asc');
  const [number, setNumber] = useState(false);

  const out = useMemo(() => {
    let lines = input.split('\n');
    if (trim) lines = lines.map(l => l.trim());
    if (removeBlank) lines = lines.filter(l => l.length > 0);
    if (dedupe) {
      const seen = new Set<string>();
      lines = lines.filter(l => {
        const key = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
    }
    if (sort !== 'none') {
      const coll = new Intl.Collator(undefined, { sensitivity: caseInsensitive ? 'base' : 'variant' });
      lines = [...lines].sort((x, y) => sort === 'asc' ? coll.compare(x, y) : coll.compare(y, x));
    }
    if (number) {
      const w = String(lines.length).length;
      lines = lines.map((l, i) => `${String(i + 1).padStart(w, ' ')}  ${l}`);
    }
    return lines.join('\n');
  }, [input, trim, removeBlank, dedupe, caseInsensitive, sort, number]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Input">
        <textarea spellcheck={false} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} aria-label="Input lines" />
      </Panel>
      <Panel title="Output" action={<CopyBtn value={() => out} />}>
        <textarea readOnly value={out} aria-label="Processed lines" />
      </Panel>
      <div class="md:col-span-2">
        <Row>
          <label class="text-xs inline-flex items-center gap-1.5"><input type="checkbox" checked={trim} onChange={(e) => setTrim((e.target as HTMLInputElement).checked)} />Trim</label>
          <label class="text-xs inline-flex items-center gap-1.5"><input type="checkbox" checked={removeBlank} onChange={(e) => setRemoveBlank((e.target as HTMLInputElement).checked)} />Remove blanks</label>
          <label class="text-xs inline-flex items-center gap-1.5"><input type="checkbox" checked={dedupe} onChange={(e) => setDedupe((e.target as HTMLInputElement).checked)} />Dedupe</label>
          <label class="text-xs inline-flex items-center gap-1.5"><input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive((e.target as HTMLInputElement).checked)} />Case-insensitive</label>
          <label class="text-xs inline-flex items-center gap-1.5"><input type="checkbox" checked={number} onChange={(e) => setNumber((e.target as HTMLInputElement).checked)} />Number lines</label>
          <select value={sort} onChange={(e) => setSort((e.target as HTMLSelectElement).value as any)} class="text-xs">
            <option value="none">No sort</option>
            <option value="asc">Sort ascending</option>
            <option value="desc">Sort descending</option>
          </select>
        </Row>
      </div>
    </div>
  );
}
