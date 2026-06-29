import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

interface ToolEntry {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export default function CommandPalette({ tools }: { tools: ToolEntry[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    function onClick(e: Event) {
      const target = e.target as HTMLElement | null;
      if (target?.closest('#open-cmdk')) setOpen(true);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!q.trim()) return tools.slice(0, 12);
    const terms = q.toLowerCase().trim().split(/\s+/);
    return tools
      .filter(t => {
        const haystack = `${t.title} ${t.slug} ${t.description} ${t.category}`.toLowerCase();
        return terms.every(term => haystack.includes(term));
      })
      .slice(0, 20);
  }, [q, tools]);

  useEffect(() => { setActive(0); }, [q]);

  function go(slug: string) {
    setOpen(false);
    window.location.href = '/' + slug;
  }

  function onInputKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); go(filtered[active].slug); }
  }

  if (!open) return null;

  return (
    <div
      class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div class="absolute inset-0 bg-black/40" />
      <div class="relative w-full max-w-xl card shadow-soft overflow-hidden">
        <div class="flex items-center gap-2 px-3 border-b border-border">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools and guides..."
            value={q}
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            onKeyDown={onInputKey}
            class="flex-1 bg-transparent border-0 py-3 outline-none text-base"
          />
          <span class="kbd">Esc</span>
        </div>
        <ul class="max-h-80 overflow-auto py-1" role="listbox">
          {filtered.length === 0 && (
            <li class="px-4 py-6 text-sm text-muted text-center">No results match "{q}".</li>
          )}
          {filtered.map((t, i) => (
            <li
              key={t.slug}
              role="option"
              aria-selected={i === active}
              class={`px-4 py-2 cursor-pointer flex items-center justify-between ${i === active ? 'bg-surface' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(t.slug)}
            >
              <div>
                <div class="text-sm font-medium">{t.title}</div>
                <div class="text-xs text-muted">{t.description}</div>
              </div>
              <span class="text-[10px] uppercase tracking-wider text-muted">{t.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
