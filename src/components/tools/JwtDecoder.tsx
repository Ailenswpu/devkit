import { useMemo, useState } from 'preact/hooks';
import { CopyBtn, Panel } from './_shared';

function b64urlDecode(s: string): string {
  let str = s.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bytes = Uint8Array.from(atob(str), (ch) => ch.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function parsePart(part: string) {
  try {
    return { obj: JSON.parse(b64urlDecode(part)), err: '' };
  } catch (e) {
    return { obj: null, err: (e as Error).message };
  }
}

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldktpdCBVc2VyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.S5ZQyZ7lYf4SnYC1B1cP_2LJxV5Y5Y5Y5Y5Y5Y5Y5Y5';

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE);

  const decoded = useMemo(() => {
    const parts = token.trim().split('.');
    if (parts.length < 2) return { header: null, payload: null, signature: '', error: 'JWT must have 3 dot-separated parts' };
    const h = parsePart(parts[0]);
    const p = parsePart(parts[1]);
    return {
      header: h.obj,
      payload: p.obj,
      signature: parts[2] || '',
      error: h.err || p.err || '',
    };
  }, [token]);

  const now = Math.floor(Date.now() / 1000);
  const exp = decoded.payload?.exp;
  const expStatus = typeof exp === 'number'
    ? (exp > now ? `Valid, expires in ${humanize(exp - now)}` : `Expired ${humanize(now - exp)} ago`)
    : '';

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="JWT" error={decoded.error}>
        <textarea
          spellcheck={false}
          value={token}
          onInput={(e) => setToken((e.target as HTMLTextAreaElement).value)}
          aria-label="JWT input"
        />
        {expStatus && <div class="text-xs text-muted">{expStatus}</div>}
      </Panel>
      <div class="space-y-3">
        <Panel title="Header" action={<CopyBtn value={() => JSON.stringify(decoded.header, null, 2)} />}>
          <textarea readOnly value={decoded.header ? JSON.stringify(decoded.header, null, 2) : ''} class="!min-h-[100px]" />
        </Panel>
        <Panel title="Payload" action={<CopyBtn value={() => JSON.stringify(decoded.payload, null, 2)} />}>
          <textarea readOnly value={decoded.payload ? JSON.stringify(decoded.payload, null, 2) : ''} />
        </Panel>
      </div>
      <div class="md:col-span-2 text-xs text-muted">
        Signature: <code class="text-fg">{decoded.signature || '(none)'}</code> — signature verification is not performed in-browser by design.
      </div>
    </div>
  );
}

function humanize(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}
