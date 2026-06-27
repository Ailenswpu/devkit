import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';
import { Panel, Row, Tabs } from './_shared';

export default function QrCodeTool() {
  const [text, setText] = useState('https://inbrowser.sh');
  const [ec, setEc] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, text || ' ', { errorCorrectionLevel: ec, width: 280, margin: 2 })
      .then(() => setErr(''))
      .catch((e: Error) => setErr(e.message));
  }, [text, ec]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr.png';
    a.click();
  }

  return (
    <div class="grid gap-4 md:grid-cols-2">
      <Panel title="Text or URL" error={err}>
        <textarea spellcheck={false} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} aria-label="Text or URL" />
        <Row>
          <span class="text-xs text-muted">Error correction</span>
          <Tabs
            tabs={[{ id: 'L', label: 'L' }, { id: 'M', label: 'M' }, { id: 'Q', label: 'Q' }, { id: 'H', label: 'H' }]}
            value={ec}
            onChange={(v) => setEc(v as any)}
          />
        </Row>
      </Panel>
      <Panel title="QR" action={<button class="btn btn-ghost text-xs" onClick={download}>Download PNG</button>}>
        <div class="card p-4 flex items-center justify-center bg-white rounded-lg">
          <canvas ref={canvasRef} aria-label="QR code preview" />
        </div>
      </Panel>
    </div>
  );
}
