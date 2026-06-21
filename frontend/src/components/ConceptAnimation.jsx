// Animated "idea" shown before a question - ChessReels-style: teach, then test.
// Hand-built canvas animations so far:
//   kind: "tangent"     - a secant line slides until it becomes the tangent (derivative)
//   kind: "area"        - rectangles get thinner until they fill the area (integral)
//   kind: "exponential" - y = 2^x climbs and crosses y = 16 at x = 4 (solving 2^x = 16)
//   kind: "product"     - a rectangle grows; the added strips show (uv)' = u'v + uv'
// Add a new `kind` by writing another draw function and registering it below.
import { useRef, useEffect, useState } from "react";

const GREEN = "#54e08a";
const GREEN_DIM = "rgba(84,224,138,0.35)";
const INK = "#e9f3ec";
const MUTED = "#7f9a89";

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

// ---- shared helpers ------------------------------------------------------
function makeMapper(W, H, xMin, xMax, yMin, yMax, pad = 26) {
  const mapX = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const mapY = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);
  return { mapX, mapY };
}

function drawBoard(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "rgba(6,14,9,0.6)";
  ctx.fillRect(0, 0, W, H);
  // faint chalk grid
  ctx.strokeStyle = "rgba(84,224,138,0.10)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 24) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 24) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function drawAxes(ctx, m, xMin, xMax, yMin, yMax) {
  ctx.strokeStyle = "rgba(127,154,137,0.6)";
  ctx.lineWidth = 1.5;
  // x-axis
  ctx.beginPath(); ctx.moveTo(m.mapX(xMin), m.mapY(0)); ctx.lineTo(m.mapX(xMax), m.mapY(0)); ctx.stroke();
  // y-axis
  ctx.beginPath(); ctx.moveTo(m.mapX(0), m.mapY(yMin)); ctx.lineTo(m.mapX(0), m.mapY(yMax)); ctx.stroke();
}

// ---- kind: tangent -------------------------------------------------------
function drawTangent(ctx, W, H, t) {
  const xMin = -0.4, xMax = 3.2, yMin = -0.6, yMax = 9.4;
  const f = (x) => x * x;
  const m = makeMapper(W, H, xMin, xMax, yMin, yMax);
  drawBoard(ctx, W, H);
  drawAxes(ctx, m, xMin, xMax, yMin, yMax);

  // the curve y = x^2
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = xMin; x <= xMax; x += 0.02) {
    const px = m.mapX(x), py = m.mapY(f(x));
    x === xMin ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  const a = 1.2;
  const hMax = 1.6;
  const e = easeInOut(Math.min(t / 0.85, 1));
  const h = Math.max(hMax * (1 - e), 0.0001);
  const xq = a + h;
  const slope = (f(xq) - f(a)) / h; // = 2a + h → 2a

  // secant / tangent line through P with current slope
  const lineY = (x) => f(a) + slope * (x - a);
  ctx.strokeStyle = t > 0.82 ? GREEN : "#ffd34d"; // turns green once it's the tangent
  ctx.lineWidth = 2.5;
  ctx.setLineDash(t > 0.82 ? [] : [6, 5]);
  ctx.beginPath();
  ctx.moveTo(m.mapX(xMin), m.mapY(lineY(xMin)));
  ctx.lineTo(m.mapX(xMax), m.mapY(lineY(xMax)));
  ctx.stroke();
  ctx.setLineDash([]);

  // point Q (hollow) - slides into P
  if (h > 0.05) {
    ctx.fillStyle = "#0c130e";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(m.mapX(xq), m.mapY(f(xq)), 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  // point P (solid)
  ctx.fillStyle = GREEN;
  ctx.beginPath(); ctx.arc(m.mapX(a), m.mapY(f(a)), 6, 0, Math.PI * 2); ctx.fill();

  // slope readout
  ctx.font = "700 15px Nunito, sans-serif";
  ctx.fillStyle = t > 0.82 ? GREEN : INK;
  const label = t > 0.82
    ? `gradient = 2a = ${(2 * a).toFixed(1)}`
    : `secant slope ≈ ${slope.toFixed(2)}`;
  ctx.fillText(label, 14, 24);
}

// ---- kind: area ----------------------------------------------------------
function drawArea(ctx, W, H, t) {
  const xMin = -0.3, xMax = 3.5, yMin = -0.6, yMax = 8.2;
  const f = (x) => 2 * x + 1;
  const a = 0, b = 3;
  const m = makeMapper(W, H, xMin, xMax, yMin, yMax);
  drawBoard(ctx, W, H);
  drawAxes(ctx, m, xMin, xMax, yMin, yMax);

  const e = easeInOut(Math.min(t / 0.9, 1));
  const n = Math.max(1, Math.round(lerp(1, 44, e)));
  const dx = (b - a) / n;

  // rectangles (right endpoints)
  let sum = 0;
  ctx.fillStyle = "rgba(84,224,138,0.22)";
  ctx.strokeStyle = GREEN_DIM;
  ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const xr = a + (i + 1) * dx;
    const hgt = f(xr);
    sum += hgt * dx;
    const px = m.mapX(a + i * dx);
    const pw = m.mapX(a + (i + 1) * dx) - px;
    const py = m.mapY(hgt);
    ctx.fillRect(px, py, pw, m.mapY(0) - py);
    ctx.strokeRect(px, py, pw, m.mapY(0) - py);
  }

  // the curve y = 2x + 1
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = xMin; x <= xMax; x += 0.02) {
    const px = m.mapX(x), py = m.mapY(f(x));
    x === xMin ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  // readout
  ctx.font = "700 15px Nunito, sans-serif";
  ctx.fillStyle = INK;
  ctx.fillText(`${n} rectangles · area ≈ ${sum.toFixed(2)}`, 14, 24);
  if (t > 0.85) {
    ctx.fillStyle = GREEN;
    ctx.fillText("→ exact area = 12", 14, 44);
  }
}

// ---- kind: exponential ---------------------------------------------------
// y = 2^x climbs and we watch it cross y = 16 at x = 4 (solves 2^x = 16).
function drawExponential(ctx, W, H, t) {
  const xMin = -0.3, xMax = 4.7, yMin = -1.4, yMax = 18.5;
  const f = (x) => Math.pow(2, x);
  const m = makeMapper(W, H, xMin, xMax, yMin, yMax);
  drawBoard(ctx, W, H);
  drawAxes(ctx, m, xMin, xMax, yMin, yMax);

  // target line y = 16
  ctx.strokeStyle = "rgba(255,211,77,0.85)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(m.mapX(xMin), m.mapY(16));
  ctx.lineTo(m.mapX(xMax), m.mapY(16));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = "700 13px Nunito, sans-serif";
  ctx.fillStyle = "#ffd34d";
  ctx.fillText("y = 16", m.mapX(xMax) - 54, m.mapY(16) - 6);

  // curve y = 2^x draws in as t grows
  const e = easeInOut(Math.min(t / 0.85, 1));
  const xNow = lerp(0, 4, e);
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let x = xMin; x <= xNow + 0.0001; x += 0.02) {
    const px = m.mapX(x), py = m.mapY(f(x));
    started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), (started = true));
  }
  ctx.stroke();

  // doubling dots at each integer reached so far (2, 4, 8, 16)
  ctx.font = "700 12px Nunito, sans-serif";
  for (let k = 1; k <= 4; k++) {
    if (xNow + 0.001 >= k) {
      ctx.fillStyle = k === 4 && t > 0.8 ? GREEN : INK;
      ctx.beginPath(); ctx.arc(m.mapX(k), m.mapY(f(k)), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = MUTED;
      ctx.fillText(String(f(k)), m.mapX(k) + 7, m.mapY(f(k)) - 6);
    }
  }

  // moving marker on the curve
  ctx.fillStyle = GREEN;
  ctx.beginPath(); ctx.arc(m.mapX(xNow), m.mapY(f(xNow)), 6, 0, Math.PI * 2); ctx.fill();

  // readout
  ctx.font = "700 15px Nunito, sans-serif";
  ctx.fillStyle = INK;
  ctx.fillText(`2^x   (x = ${xNow.toFixed(2)})`, 14, 24);

  if (t > 0.85) {
    ctx.strokeStyle = GREEN_DIM;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(m.mapX(4), m.mapY(16));
    ctx.lineTo(m.mapX(4), m.mapY(0));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = GREEN;
    ctx.fillText("2^4 = 16  →  x = 4", 14, 44);
  }
}

// ---- kind: product (product rule via a growing rectangle) ----------------
// Area = u·v. Nudge x: width grows by du, height by dv. The added area is the
// two strips v·du + u·dv (the corner du·dv is negligible), giving (uv)'=u'v+uv'.
function drawProduct(ctx, W, H, t) {
  drawBoard(ctx, W, H);

  const u0 = 2.2, v0 = 1.5, duMax = 0.95, dvMax = 0.7;
  const scale = Math.min((W - 130) / (u0 + duMax), (H - 95) / (v0 + dvMax));
  const totalW = (u0 + duMax) * scale;
  const totalH = (v0 + dvMax) * scale;
  const ox = (W - totalW) / 2 + 8;
  const oy = (H + totalH) / 2 - 4; // bottom-left corner of the rectangle

  const e = easeInOut(Math.min(t / 0.9, 1));
  const du = duMax * e, dv = dvMax * e;
  const px = (ux) => ox + ux * scale;
  const py = (vy) => oy - vy * scale;

  // base rectangle (area uv)
  ctx.fillStyle = "rgba(84,224,138,0.28)";
  ctx.fillRect(px(0), py(v0), u0 * scale, v0 * scale);
  ctx.strokeStyle = GREEN; ctx.lineWidth = 2;
  ctx.strokeRect(px(0), py(v0), u0 * scale, v0 * scale);

  // right strip v·du
  if (du > 0.001) {
    ctx.fillStyle = "rgba(255,211,77,0.30)";
    ctx.fillRect(px(u0), py(v0), du * scale, v0 * scale);
    ctx.strokeStyle = "rgba(255,211,77,0.85)";
    ctx.strokeRect(px(u0), py(v0), du * scale, v0 * scale);
  }
  // top strip u·dv
  if (dv > 0.001) {
    ctx.fillStyle = "rgba(120,180,255,0.30)";
    ctx.fillRect(px(0), py(v0 + dv), u0 * scale, dv * scale);
    ctx.strokeStyle = "rgba(120,180,255,0.85)";
    ctx.strokeRect(px(0), py(v0 + dv), u0 * scale, dv * scale);
  }
  // corner du·dv (negligible)
  if (du > 0.001 && dv > 0.001) {
    ctx.fillStyle = "rgba(251,113,133,0.30)";
    ctx.fillRect(px(u0), py(v0 + dv), du * scale, dv * scale);
    ctx.strokeStyle = "rgba(251,113,133,0.85)";
    ctx.strokeRect(px(u0), py(v0 + dv), du * scale, dv * scale);
  }

  // side labels u, v
  ctx.font = "700 14px Nunito, sans-serif";
  ctx.fillStyle = INK;
  ctx.fillText("u", px(u0 / 2) - 4, oy + 18);
  ctx.save();
  ctx.translate(ox - 16, py(v0 / 2));
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("v", 0, 0);
  ctx.restore();

  // area labels
  ctx.fillStyle = GREEN;
  ctx.fillText("uv", px(u0 / 2) - 9, py(v0 / 2) + 4);
  if (e > 0.25) {
    ctx.font = "700 12px Nunito, sans-serif";
    ctx.fillStyle = "#ffd34d";
    ctx.fillText("v·du", px(u0) + (du * scale) / 2 - 14, py(v0 / 2));
    ctx.fillStyle = "#9ec5ff";
    ctx.fillText("u·dv", px(u0 / 2) - 13, py(v0 + dv / 2) + 4);
  }

  // readout
  ctx.font = "700 15px Nunito, sans-serif";
  ctx.fillStyle = t > 0.85 ? GREEN : INK;
  ctx.fillText(t > 0.85 ? "(uv)' = u'v + uv'" : "Δ(uv) = v·du + u·dv + ...", 14, 22);
}

const RENDERERS = {
  tangent: drawTangent,
  area: drawArea,
  exponential: drawExponential,
  product: drawProduct
};

// Evenly spaced caption change points for however many captions a concept has.
// e.g. 5 captions -> cuts at 0.2, 0.4, 0.6, 0.8 (4 boundaries between 5 slots).
function captionCuts(count) {
  if (count <= 1) return [];
  return Array.from({ length: count - 1 }, (_, i) => (i + 1) / count);
}

export default function ConceptAnimation({ concept }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const playingRef = useRef(true);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);

  const draw = RENDERERS[concept.kind] || drawTangent;
  const captions = concept.captions || [];
  const CUTS = captionCuts(captions.length);
  const DURATION = 9000;
  const TOTAL = DURATION + 1800; // pause on the final frame before looping

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    lastRef.current = performance.now();
    const frame = (now) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      if (playingRef.current) elapsedRef.current = (elapsedRef.current + dt) % TOTAL;
      const t = Math.min(elapsedRef.current / DURATION, 1);
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, t);
      const idx = CUTS.filter((c) => t >= c).length;
      setPhase((p) => (p !== idx ? idx : p));
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [concept.kind, draw, DURATION, TOTAL]);

  const toggle = () => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };
  const replay = () => {
    elapsedRef.current = 0;
    playingRef.current = true;
    setPlaying(true);
  };

  return (
    <div className="concept-anim">
      <canvas ref={canvasRef} className="anim-canvas" />
      <div className="anim-controls">
        <button className="anim-btn" onClick={toggle}>{playing ? "❚❚" : "▶"}</button>
        <button className="anim-btn" onClick={replay}>↻ replay</button>
        <div className="anim-dots">
          {captions.map((_, i) => (
            <span key={i} className={"anim-dot" + (i === phase ? " on" : "")} />
          ))}
        </div>
      </div>
      <p className="anim-caption" key={phase}>{captions[phase]}</p>
    </div>
  );
}
