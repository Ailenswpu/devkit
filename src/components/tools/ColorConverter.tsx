import { useMemo, useState } from 'preact/hooks';
import { colord } from 'colord';
import { Panel } from './_shared';

export default function ColorConverter() {
  const [input, setInput] = useState('#6366F1');
  const parsed = useMemo(() => colord(input), [input]);
  const ok = parsed.isValid();

  const hex = ok ? parsed.toHex() : '';
  const rgb = ok ? parsed.toRgbString() : '';
  const hsl = ok ? parsed.toHslString() : '';

  return (
    <div class="grid gap-4">
      <div class="flex items-center gap-3">
        <div
          class="w-24 h-24 rounded-xl border border-border shadow-soft"
          style={{ background: ok ? hex : 'transparent' }}
          aria-label="Color preview"
        />
        <div class="flex-1">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted">Any value</label>
          <input
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            class={!ok ? '!border-red-500' : ''}
            aria-label="Color value"
          />
          <p class="text-xs text-muted mt-1">Accepts HEX, RGB, HSL, named colors…</p>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <Panel title="HEX"><input readOnly value={hex} aria-label="HEX value" /></Panel>
        <Panel title="RGB"><input readOnly value={rgb} aria-label="RGB value" /></Panel>
        <Panel title="HSL"><input readOnly value={hsl} aria-label="HSL value" /></Panel>
      </div>
    </div>
  );
}
