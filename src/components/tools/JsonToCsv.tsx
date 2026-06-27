import { useMemo, useState } from 'preact/hooks';
import Papa from 'papaparse';
import { CopyBtn, Panel, Tabs } from './_shared';

const SAMPLE_JSON = JSON.stringify(
  [
    { id: 1, name: 'Ada', role: 'engineer' },
    { id: 2, name: 'Bo', role: 'designer' },
    { id: 3, name: 'Cy', role: 'pm' },
  ],
  null,
  2,
);

export default function JsonToCsv() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [mode, setMode] = useState<'json2csv' | 'csv2json'>('json2csv');

  const { out, error } = useMemo(() => {
    try {
      if (mode === 'json2csv') {
        const arr = JSON.parse(input);
        if (!Array.isArray(arr)) throw new Error('Top-level value must be an array of objects.');
        return { out: Papa.unparse(arr), error: '' };
      }
      const res = Papa.parse(input, { header: true, skipEmptyLines: true });
      if (res.errors.length) return { out: '', error: res.errors[0].message };
      return { out: JSON.stringify(res.data, null, 2), error: '' };
    } catch (e) {
      return { out: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title={mode === 'json2csv' ? 'JSON' : 'CSV'} error={error}>
        <textarea spellcheck={false} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} aria-label="Input" />
      </Panel>
      <Panel title={mode === 'json2csv' ? 'CSV' : 'JSON'} action={<CopyBtn value={() => out} />}>
        <textarea readOnly value={out} aria-label="Output" />
      </Panel>
      <div class="md:col-span-2">
        <Tabs tabs={[{ id: 'json2csv', label: 'JSON → CSV' }, { id: 'csv2json', label: 'CSV → JSON' }]} value={mode} onChange={(v) => setMode(v as any)} />
      </div>
    </div>
  );
}
