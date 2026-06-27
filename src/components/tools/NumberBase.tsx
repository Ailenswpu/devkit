import { useState } from 'preact/hooks';
import { Panel, Row } from './_shared';

type BaseKey = 'bin' | 'oct' | 'dec' | 'hex';
const RADIX: Record<BaseKey, number> = { bin: 2, oct: 8, dec: 10, hex: 16 };

function parseBig(value: string, radix: number): bigint | null {
  const v = value.trim();
  if (!v) return 0n;
  try {
    let s = v;
    let sign = 1n;
    if (s.startsWith('-')) { sign = -1n; s = s.slice(1); }
    if (!new RegExp(`^[0-9a-f]+$`, 'i').test(s)) return null;
    let result = 0n;
    for (const ch of s.toLowerCase()) {
      const d = ch >= 'a' ? ch.charCodeAt(0) - 87 : ch.charCodeAt(0) - 48;
      if (d >= radix) return null;
      result = result * BigInt(radix) + BigInt(d);
    }
    return sign * result;
  } catch {
    return null;
  }
}

export default function NumberBase() {
  const [vals, setVals] = useState<Record<BaseKey, string>>({ bin: '101010', oct: '52', dec: '42', hex: '2a' });
  const [err, setErr] = useState<BaseKey | null>(null);

  function update(from: BaseKey, value: string) {
    const big = parseBig(value, RADIX[from]);
    if (big === null) { setErr(from); setVals({ ...vals, [from]: value }); return; }
    setErr(null);
    setVals({
      bin: from === 'bin' ? value : big.toString(2),
      oct: from === 'oct' ? value : big.toString(8),
      dec: from === 'dec' ? value : big.toString(10),
      hex: from === 'hex' ? value : big.toString(16),
    });
  }

  const labels: { k: BaseKey; label: string }[] = [
    { k: 'bin', label: 'Binary' },
    { k: 'oct', label: 'Octal' },
    { k: 'dec', label: 'Decimal' },
    { k: 'hex', label: 'Hexadecimal' },
  ];

  return (
    <div class="grid gap-3">
      {labels.map(({ k, label }) => (
        <div class="grid gap-1.5" key={k}>
          <label class="text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>
          <input
            value={vals[k]}
            onInput={(e) => update(k, (e.target as HTMLInputElement).value)}
            class={err === k ? '!border-red-500' : ''}
            aria-label={label}
          />
        </div>
      ))}
      {err && <div class="text-xs text-red-500">Invalid digit for {err}.</div>}
    </div>
  );
}
