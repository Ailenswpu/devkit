import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export function Tabs({ tabs, value, onChange }: { tabs: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="tablist" class="inline-flex bg-bg border border-border rounded-lg p-0.5 text-sm">
      {tabs.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          class={`px-3 py-1.5 rounded-md transition-colors ${value === t.id ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function CopyBtn({ value }: { value: () => string }) {
  const [c, setC] = useState(false);
  async function go() {
    try { await navigator.clipboard.writeText(value()); setC(true); setTimeout(() => setC(false), 1200); } catch {}
  }
  return (
    <button type="button" class="btn btn-ghost text-xs" onClick={go}>
      {c ? 'Copied' : 'Copy'}
    </button>
  );
}

export function Panel({ title, action, children, error }: { title: string; action?: ComponentChildren; children: ComponentChildren; error?: string }) {
  return (
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold uppercase tracking-wider text-muted">{title}</label>
        <div class="flex items-center gap-1">{action}</div>
      </div>
      {children}
      {error && <div class="text-xs text-red-500">{error}</div>}
    </div>
  );
}

export function Row({ children }: { children: ComponentChildren }) {
  return <div class="flex flex-wrap items-center gap-2">{children}</div>;
}
