import { useMemo, useState } from 'preact/hooks';
import Papa from 'papaparse';
import { CopyBtn, Panel, Row, Tabs } from './_shared';

type Dataset = 'users' | 'orders' | 'products';
type Format = 'json' | 'csv' | 'sql';

const FIRST_NAMES = ['Ada', 'Linus', 'Grace', 'Ken', 'Margaret', 'Donald', 'Barbara', 'Alan', 'Edsger', 'Radia'];
const LAST_NAMES = ['Lovelace', 'Torvalds', 'Hopper', 'Thompson', 'Hamilton', 'Knuth', 'Liskov', 'Turing', 'Dijkstra', 'Perlman'];
const DOMAINS = ['example.com', 'test.local', 'demo.dev'];
const CITIES = ['Austin', 'Boston', 'Chicago', 'Denver', 'Seattle', 'Toronto', 'London', 'Berlin'];
const PRODUCTS = ['Starter Plan', 'Team Plan', 'API Credits', 'Storage Add-on', 'Audit Export', 'Webhook Pack'];
const STATUSES = ['new', 'active', 'paused', 'trialing'];

function rand(max: number) {
  return Math.floor(Math.random() * max);
}

function clamp(value: string, min: number, max: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function isoDate(offset: number) {
  const date = new Date(Date.UTC(2026, 0, 1 + offset));
  return date.toISOString().slice(0, 10);
}

function makeRows(dataset: Dataset, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    if (dataset === 'orders') {
      return {
        id,
        order_id: `ORD-${String(10000 + id).padStart(5, '0')}`,
        customer_email: `customer${id}@${DOMAINS[rand(DOMAINS.length)]}`,
        amount_usd: Number((29 + rand(9000) / 100).toFixed(2)),
        status: ['pending', 'paid', 'refunded', 'failed'][rand(4)],
        created_at: isoDate(rand(120)),
      };
    }
    if (dataset === 'products') {
      const name = PRODUCTS[rand(PRODUCTS.length)];
      return {
        id,
        sku: `SKU-${String(id).padStart(4, '0')}`,
        name,
        category: ['subscription', 'usage', 'addon'][rand(3)],
        price_usd: Number((9 + rand(4900) / 100).toFixed(2)),
        active: rand(10) > 1,
      };
    }
    const first = FIRST_NAMES[rand(FIRST_NAMES.length)];
    const last = LAST_NAMES[rand(LAST_NAMES.length)];
    return {
      id,
      full_name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${id}@${DOMAINS[rand(DOMAINS.length)]}`,
      city: CITIES[rand(CITIES.length)],
      status: STATUSES[rand(STATUSES.length)],
      signup_date: isoDate(rand(180)),
    };
  });
}

function sqlValue(value: unknown) {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return `'${String(value).replaceAll("'", "''")}'`;
}

function toSql(dataset: Dataset, rows: Record<string, unknown>[]) {
  const table = `mock_${dataset}`;
  const columns = Object.keys(rows[0] || {});
  return rows
    .map((row) => `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map((col) => sqlValue(row[col])).join(', ')});`)
    .join('\n');
}

export default function MockDataGenerator() {
  const [dataset, setDataset] = useState<Dataset>('users');
  const [format, setFormat] = useState<Format>('json');
  const [count, setCount] = useState(10);
  const [nonce, setNonce] = useState(0);

  const { rows, output } = useMemo(() => {
    const generated = makeRows(dataset, count);
    if (format === 'csv') return { rows: generated, output: Papa.unparse(generated) };
    if (format === 'sql') return { rows: generated, output: toSql(dataset, generated) };
    return { rows: generated, output: JSON.stringify(generated, null, 2) };
  }, [dataset, format, count, nonce]);

  return (
    <div class="grid gap-4">
      <Row>
        <Tabs
          tabs={[
            { id: 'users', label: 'Users' },
            { id: 'orders', label: 'Orders' },
            { id: 'products', label: 'Products' },
          ]}
          value={dataset}
          onChange={(value) => setDataset(value as Dataset)}
        />
        <Tabs
          tabs={[
            { id: 'json', label: 'JSON' },
            { id: 'csv', label: 'CSV' },
            { id: 'sql', label: 'SQL' },
          ]}
          value={format}
          onChange={(value) => setFormat(value as Format)}
        />
        <label class="text-xs text-muted">
          Rows
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            class="ml-2 w-20"
            onInput={(event) => setCount(clamp((event.target as HTMLInputElement).value, 1, 100))}
          />
        </label>
        <button type="button" class="btn btn-primary ml-auto" onClick={() => setNonce((value) => value + 1)}>
          Generate
        </button>
      </Row>

      <Panel title={`${dataset} mock data`} action={<CopyBtn value={() => output} />}>
        <textarea readOnly class="!min-h-[320px]" value={output} aria-label="Generated mock data" />
      </Panel>

      <p class="text-xs text-muted">
        Generated rows are synthetic placeholders for local development, QA fixtures and demos. Do not use them as real customer, billing or identity data.
      </p>
    </div>
  );
}
