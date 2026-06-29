import { useEffect, useMemo, useState } from 'preact/hooks';
import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

const ZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
];

const pad = (n: number) => String(n).padStart(2, '0');
const localInput = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

function fmt(date: Date, timeZone?: string) {
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date);
}

function parseLocalDateTime(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(value('year'), value('month') - 1, value('day'), value('hour'), value('minute'), value('second'));
  return asUtc - date.getTime();
}

function parseDateTimeInZone(value: string, timeZone: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, y, m, d, h, min] = match.map(Number);
  let utc = Date.UTC(y, m - 1, d, h, min, 0);
  for (let i = 0; i < 2; i++) {
    utc = Date.UTC(y, m - 1, d, h, min, 0) - getZoneOffsetMs(new Date(utc), timeZone);
  }
  const out = new Date(utc);
  return Number.isNaN(out.getTime()) ? null : out;
}

function describeCron(expr: string, timeZone: string) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { error: 'Use a five-field cron expression: minute hour day month weekday.', text: '', next: [] as Date[] };
  try {
    const interval = CronExpressionParser.parse(expr, { tz: timeZone, currentDate: new Date() });
    const next = Array.from({ length: 5 }, () => interval.next().toDate());
    return { error: '', text: cronstrue.toString(expr), next };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid cron expression.', text: '', next: [] as Date[] };
  }
}

function businessShift(start: Date, amount: number) {
  const d = new Date(start);
  const dir = Math.sign(amount) || 1;
  let left = Math.abs(amount);
  while (left > 0) {
    d.setDate(d.getDate() + dir);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  return d;
}

function isoWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: d.getUTCFullYear(), weekday: day };
}

export function TimestampTool() {
  const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate');
  const [stamp, setStamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateInput, setDateInput] = useState(localInput());
  const date = useMemo(() => mode === 'toDate'
    ? new Date(Number(stamp) * (unit === 'seconds' ? 1000 : 1))
    : parseLocalDateTime(dateInput), [mode, stamp, unit, dateInput]);
  const output = date && !Number.isNaN(date.getTime()) ? {
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
    iso: date.toISOString(),
    utc: fmt(date, 'UTC'),
    local: fmt(date),
  } : null;

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Input">
        <Tabs tabs={[{ id: 'toDate', label: 'Timestamp → Date' }, { id: 'toTimestamp', label: 'Date → Timestamp' }]} value={mode} onChange={(v) => setMode(v as any)} />
        {mode === 'toDate' ? (
          <div class="mt-3 grid gap-3">
            <input value={stamp} onInput={(e) => setStamp((e.target as HTMLInputElement).value)} aria-label="Timestamp input" />
            <Tabs tabs={[{ id: 'seconds', label: 'Seconds' }, { id: 'milliseconds', label: 'Milliseconds' }]} value={unit} onChange={(v) => setUnit(v as any)} />
          </div>
        ) : (
          <input class="mt-3" type="datetime-local" value={dateInput} onInput={(e) => setDateInput((e.target as HTMLInputElement).value)} aria-label="Date input" />
        )}
      </Panel>
      <Panel title="Output" action={<CopyBtn value={() => output ? output.iso : ''} />}>
        <pre class="card p-3 text-sm overflow-auto whitespace-pre-wrap">{output ? `Unix seconds: ${output.seconds}\nUnix milliseconds: ${output.milliseconds}\nISO 8601: ${output.iso}\nUTC: ${output.utc}\nLocal: ${output.local}` : 'Invalid input'}</pre>
      </Panel>
    </div>
  );
}

export function TimestampNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const rows = [
    ['Unix seconds', String(Math.floor(now.getTime() / 1000))],
    ['Unix milliseconds', String(now.getTime())],
    ['ISO 8601', now.toISOString()],
    ['RFC 2822', now.toUTCString()],
    ['Local', fmt(now)],
  ];
  return <div class="grid gap-3">{rows.map(([label, value]) => <div class="card p-3 flex items-center gap-3"><div class="text-xs font-semibold uppercase text-muted w-36">{label}</div><code class="flex-1 break-all">{value}</code><CopyBtn value={() => value} /></div>)}</div>;
}

export function CronTool() {
  const [expr, setExpr] = useState('*/5 * * * *');
  const [zone, setZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const result = useMemo(() => describeCron(expr, zone), [expr, zone]);
  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Cron expression" error={result.error}>
        <input value={expr} onInput={(e) => setExpr((e.target as HTMLInputElement).value)} aria-label="Cron expression" />
        <select class="mt-3" value={zone} onChange={(e) => setZone((e.target as HTMLSelectElement).value)} aria-label="Cron timezone">
          {ZONES.map(z => <option value={z}>{z}</option>)}
        </select>
        <div class="mt-3 flex flex-wrap gap-2">
          {['* * * * *', '*/5 * * * *', '0 * * * *', '0 9 * * 1-5', '0 0 * * 0'].map(p => <button class="btn btn-ghost text-xs" onClick={() => setExpr(p)}>{p}</button>)}
        </div>
      </Panel>
      <Panel title="Explanation" action={<CopyBtn value={() => result.text} />}>
        <p class="text-sm text-muted">{result.error || result.text}</p>
        <ol class="mt-3 space-y-1 text-sm">
          {result.next.map((d) => <li><code>{fmt(d)}</code></li>)}
        </ol>
      </Panel>
    </div>
  );
}

export function TimezoneConverter() {
  const [value, setValue] = useState(localInput());
  const [source, setSource] = useState('UTC');
  const date = parseDateTimeInZone(value, source);
  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Source">
        <input type="datetime-local" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} aria-label="Source date time" />
        <select class="mt-3" value={source} onChange={(e) => setSource((e.target as HTMLSelectElement).value)} aria-label="Source timezone">{ZONES.map(z => <option value={z}>{z}</option>)}</select>
      </Panel>
      <Panel title="Converted times">
        <div class="grid gap-2">{ZONES.map(z => <div class="card p-3 text-sm"><div class="font-semibold">{z}</div><div class="text-muted">{date ? fmt(date, z) : 'Invalid date'}</div></div>)}</div>
        <p class="mt-2 text-xs text-muted">The input is interpreted as wall-clock time in {source}. Outputs use IANA time zone formatting and daylight-saving rules.</p>
      </Panel>
    </div>
  );
}

export function DateDiff() {
  const [a, setA] = useState(localInput(new Date(Date.now() - 86400000 * 7)));
  const [b, setB] = useState(localInput());
  const out = useMemo(() => {
    const da = parseLocalDateTime(a), db = parseLocalDateTime(b);
    if (!da || !db) return null;
    const ms = db.getTime() - da.getTime();
    const days = Math.floor(Math.abs(ms) / 86400000);
    let weekdays = 0, weekends = 0;
    const cur = new Date(da < db ? da : db);
    const end = new Date(da < db ? db : da);
    while (cur < end) { (cur.getDay() === 0 || cur.getDay() === 6) ? weekends++ : weekdays++; cur.setDate(cur.getDate() + 1); }
    return { ms, days, hours: Math.floor(Math.abs(ms) / 3600000), minutes: Math.floor(Math.abs(ms) / 60000), weekdays, weekends };
  }, [a, b]);
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Dates"><input type="datetime-local" value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} /><input class="mt-3" type="datetime-local" value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} /></Panel><Panel title="Difference"><pre class="card p-3 text-sm">{out ? `Days: ${out.days}\nHours: ${out.hours}\nMinutes: ${out.minutes}\nWeekdays: ${out.weekdays}\nWeekend days: ${out.weekends}` : 'Invalid date'}</pre></Panel></div>;
}

export function DateCalculator() {
  const [start, setStart] = useState(localInput().slice(0, 10));
  const [amount, setAmount] = useState(14);
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const [weekdays, setWeekdays] = useState(false);
  const result = useMemo(() => {
    const d = new Date(`${start}T00:00`);
    const n = op === 'add' ? amount : -amount;
    if (weekdays && unit === 'days') return businessShift(d, n);
    if (unit === 'days') d.setDate(d.getDate() + n);
    if (unit === 'weeks') d.setDate(d.getDate() + n * 7);
    if (unit === 'months') d.setMonth(d.getMonth() + n);
    if (unit === 'years') d.setFullYear(d.getFullYear() + n);
    return d;
  }, [start, amount, unit, op, weekdays]);
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Calculate"><input type="date" value={start} onInput={(e) => setStart((e.target as HTMLInputElement).value)} /><Row><Tabs tabs={[{ id: 'add', label: 'Add' }, { id: 'subtract', label: 'Subtract' }]} value={op} onChange={(v) => setOp(v as any)} /><input type="number" value={amount} onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value) || 0)} class="!w-24" /><select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as any)}>{['days','weeks','months','years'].map(u => <option value={u}>{u}</option>)}</select></Row><label class="text-xs text-muted inline-flex gap-2"><input type="checkbox" checked={weekdays} onChange={(e) => setWeekdays((e.target as HTMLInputElement).checked)} />Skip weekends for day calculations</label></Panel><Panel title="Result"><pre class="card p-3 text-sm">{fmt(result)}</pre></Panel></div>;
}

export function CountdownTool() {
  const [target, setTarget] = useState(localInput(new Date(Date.now() + 86400000)));
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const d = parseLocalDateTime(target);
  const diff = d ? d.getTime() - now : 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor(abs / 3600000) % 24;
  const mins = Math.floor(abs / 60000) % 60;
  const secs = Math.floor(abs / 1000) % 60;
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Target"><input type="datetime-local" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} /></Panel><Panel title="Remaining"><div class="card p-5 text-2xl font-mono">{d ? `${diff < 0 ? '-' : ''}${days}d ${hours}h ${mins}m ${secs}s` : 'Invalid date'}</div></Panel></div>;
}

export function Iso8601Tool() {
  const [value, setValue] = useState(new Date().toISOString());
  const date = new Date(value);
  const ok = !Number.isNaN(date.getTime());
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Date string" error={ok ? '' : 'Invalid date string'}><textarea value={value} onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)} /></Panel><Panel title="Formats" action={<CopyBtn value={() => ok ? date.toISOString() : ''} />}><pre class="card p-3 text-sm whitespace-pre-wrap">{ok ? `ISO: ${date.toISOString()}\nUTC: ${date.toUTCString()}\nLocal: ${fmt(date)}\nUnix seconds: ${Math.floor(date.getTime()/1000)}\nUnix milliseconds: ${date.getTime()}` : 'Invalid date'}</pre></Panel></div>;
}

export function DiscordTimestamp() {
  const [value, setValue] = useState(localInput(new Date(Date.now() + 3600000)));
  const [style, setStyle] = useState('R');
  const d = parseLocalDateTime(value);
  const unix = d ? Math.floor(d.getTime() / 1000) : 0;
  const tag = d ? `<t:${unix}:${style}>` : '';
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Input"><input type="datetime-local" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} /><select class="mt-3" value={style} onChange={(e) => setStyle((e.target as HTMLSelectElement).value)}>{['t','T','d','D','f','F','R'].map(s => <option value={s}>{s}</option>)}</select></Panel><Panel title="Discord tag" action={<CopyBtn value={() => tag} />}><pre class="card p-3 text-sm">{tag || 'Invalid date'}</pre></Panel></div>;
}

export function DurationConverter() {
  const [value, setValue] = useState(90);
  const [unit, setUnit] = useState('minutes');
  const mult: Record<string, number> = { seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800 };
  const seconds = value * mult[unit];
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Duration"><input type="number" value={value} onInput={(e) => setValue(Number((e.target as HTMLInputElement).value) || 0)} /><select class="mt-3" value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value)}>{Object.keys(mult).map(u => <option value={u}>{u}</option>)}</select></Panel><Panel title="Converted"><pre class="card p-3 text-sm">{`Seconds: ${seconds}\nMinutes: ${seconds / 60}\nHours: ${seconds / 3600}\nDays: ${seconds / 86400}\nWeeks: ${seconds / 604800}`}</pre></Panel></div>;
}

export function WeekNumber() {
  const [value, setValue] = useState(localInput().slice(0, 10));
  const date = new Date(`${value}T00:00`);
  const info = isoWeek(date);
  const start = new Date(date.getFullYear(), 0, 0);
  const doy = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Date"><input type="date" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} /></Panel><Panel title="ISO week"><pre class="card p-3 text-sm">{`ISO week-year: ${info.year}\nISO week: ${info.week}\nISO weekday: ${info.weekday}\nDay of year: ${doy}`}</pre></Panel></div>;
}

export function AgeCalculator() {
  const [birth, setBirth] = useState('1990-01-01');
  const today = new Date();
  const b = new Date(`${birth}T00:00`);
  let years = today.getFullYear() - b.getFullYear();
  let anniversary = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if (anniversary > today) years--;
  if (anniversary < today) anniversary = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate());
  const days = Math.ceil((anniversary.getTime() - today.getTime()) / 86400000);
  return <div class="grid gap-4 md:grid-cols-2"><Panel title="Birth date"><input type="date" value={birth} onInput={(e) => setBirth((e.target as HTMLInputElement).value)} /></Panel><Panel title="Age"><pre class="card p-3 text-sm">{`Years elapsed: ${years}\nNext anniversary: ${anniversary.toDateString()}\nDays until next anniversary: ${days}`}</pre></Panel></div>;
}
