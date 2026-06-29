import { useMemo, useState } from 'preact/hooks';
import yaml from 'js-yaml';
import { CopyBtn, Panel, Tabs } from './_shared';

const SAMPLE_JSON = JSON.stringify({ name: 'inbrowser.sh', features: { private: true, login: false }, tags: ['dev', 'tools'] }, null, 2);

export default function JsonToYaml() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [mode, setMode] = useState<'j2y' | 'y2j'>('j2y');

  const { out, error } = useMemo(() => {
    try {
      if (mode === 'j2y') {
        return { out: yaml.dump(JSON.parse(input), { indent: 2 }), error: '' };
      }
      return { out: JSON.stringify(yaml.load(input), null, 2), error: '' };
    } catch (e) {
      return { out: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title={mode === 'j2y' ? 'JSON' : 'YAML'} error={error}>
        <textarea spellcheck={false} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} aria-label="Input" />
      </Panel>
      <Panel title={mode === 'j2y' ? 'YAML' : 'JSON'} action={<CopyBtn value={() => out} />}>
        <textarea readOnly value={out} aria-label="Output" />
      </Panel>
      <div class="md:col-span-2">
        <Tabs tabs={[{ id: 'j2y', label: 'JSON → YAML' }, { id: 'y2j', label: 'YAML → JSON' }]} value={mode} onChange={(v) => setMode(v as any)} />
      </div>
    </div>
  );
}
