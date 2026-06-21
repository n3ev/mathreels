// A lightweight rough-work canvas for finger/stylus/mouse working.
// Pointer events cover touch + mouse + pen, so it works on iOS Safari too.
import { useRef, useEffect, useState } from "react";

export default function Scratchpad() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Scale for crisp lines on high-DPI screens.
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
  }, [open]);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const end = () => (drawing.current = false);

  const clear = () => {
    const c = canvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };

  return (
    <div className="scratch">
      <button className="scratch-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide rough work" : "✏️ Rough work"}
      </button>
      {open && (
        <div className="scratch-pane">
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
          <button className="scratch-clear" onClick={clear}>Clear</button>
        </div>
      )}
    </div>
  );
}
