import { useEffect, useRef } from "react";

type MohrResults = {
  sigmaP: number;
  r: number;
  sigma1: number;
  sigma2: number;
  tauMax: number;
  doubleTheta: number;
  doubleThetaP: number;
};

export default function PlotMohr({ results }: { results: MohrResults }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef(results);

  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const lastTouchDistRef = useRef<number | null>(null);

  /* =======================
     Transformación global
  ======================== */
  function applyViewTransform(ctx: CanvasRenderingContext2D) {
    const canvas = canvasRef.current!;
    ctx.translate(
      canvas.width / 2 + offsetRef.current.x,
      canvas.height / 2 + offsetRef.current.y,
    );
    ctx.scale(scaleRef.current, -scaleRef.current);
  }

  /* =======================
     Grilla
  ======================== */
  function drawGrid(ctx: CanvasRenderingContext2D) {
    const step = 50;
    const limit = 5000;

    ctx.save();
    applyViewTransform(ctx);
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1 / scaleRef.current;

    for (let x = -limit; x <= limit; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, -limit);
      ctx.lineTo(x, limit);
      ctx.stroke();
    }

    for (let y = -limit; y <= limit; y += step) {
      ctx.beginPath();
      ctx.moveTo(-limit, y);
      ctx.lineTo(limit, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* =======================
     Puntos en el de σ y τ
  ======================== */
  function drawPoint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    color: string,
  ) {
    ctx.save();
    applyViewTransform(ctx);

    ctx.translate(x, y);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 5 / scaleRef.current, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    const canvas = canvasRef.current!;
    const sx = canvas.width / 2 + offsetRef.current.x + x * scaleRef.current;
    const sy = canvas.height / 2 + offsetRef.current.y - y * scaleRef.current;

    ctx.save();
    ctx.fillStyle = color;
    ctx.font = "20px Arial";
    ctx.fillText(label, sx + 8, sy - 8);
    ctx.restore();
  }
  function drawPoints(ctx: CanvasRenderingContext2D) {
    let angle = resultsRef.current.doubleThetaP * (Math.PI / 180);
    let textX = Math.cos(angle) * resultsRef.current.r;
    let textY = Math.sin(angle) * resultsRef.current.r;
    drawPoint(
      ctx,
      resultsRef.current.sigmaP + textX,
      textY,
      `σ₁ = ${resultsRef.current.sigma1.toFixed(2)}`,
      "cyan",
    );
    drawPoint(
      ctx,
      resultsRef.current.sigmaP - textX,
      -textY,
      `σ₂ = ${resultsRef.current.sigma2.toFixed(2)}`,
      "cyan",
    );
    angle = resultsRef.current.doubleTheta * (Math.PI / 180);
    textX = Math.cos(angle) * resultsRef.current.r;
    textY = Math.sin(angle) * resultsRef.current.r;
    drawPoint(
      ctx,
      resultsRef.current.sigmaP + textX,
      textY,
      `τₘₐₓ = ${resultsRef.current.r.toFixed(2)}  `,
      "magenta",
    );
    drawPoint(
      ctx,
      resultsRef.current.sigmaP - textX,
      -textY,
      `-τₘₐₓ = ${-resultsRef.current.r.toFixed(2)}  `,
      "magenta",
    );
  }

  /* =======================
     Angulos de θₚ y 2θₚ
  ======================== */
  function drawAngleArc(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    label: string,
    color: string,
  ) {
    ctx.save();
    applyViewTransform(ctx);

    ctx.translate(centerX, centerY);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2 / scaleRef.current;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, angle, angle < 0);
    ctx.stroke();

    ctx.restore();

    const canvas = canvasRef.current!;
    const midAngle = angle / 2;

    const tx =
      canvas.width / 2 +
      offsetRef.current.x +
      (centerX + radius * Math.cos(midAngle)) * scaleRef.current;

    const ty =
      canvas.height / 2 +
      offsetRef.current.y -
      (centerY + radius * Math.sin(midAngle)) * scaleRef.current;

    ctx.save();
    ctx.fillStyle = color;
    ctx.font = "18px Arial";
    ctx.fillText(label, tx + 5, ty - 5);
    ctx.restore();
  }
  function drawAngleArcs(ctx: CanvasRenderingContext2D) {
    const cx = resultsRef.current.sigmaP;
    const cy = 0;

    const angleTheta = resultsRef.current.doubleTheta * (Math.PI / 180);
    const angleThetaP = resultsRef.current.doubleThetaP * (Math.PI / 180);

    drawAngleArc(
      ctx,
      cx,
      cy,
      resultsRef.current.r * 0.6,
      angleTheta,
      `2θₚ = ${resultsRef.current.doubleTheta.toFixed(1)}°`,
      "magenta",
    );

    drawAngleArc(
      ctx,
      cx,
      cy,
      resultsRef.current.r * 0.2,
      angleThetaP,
      `θₚ = ${resultsRef.current.doubleThetaP.toFixed(1)}°`,
      "cyan",
    );
  }

  /* =======================
     Ejes
  ======================== */
  function drawAxes(ctx: CanvasRenderingContext2D) {
    ctx.save();
    applyViewTransform(ctx);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2 / scaleRef.current;

    ctx.beginPath();
    ctx.moveTo(-5000, 0);
    ctx.lineTo(5000, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -5000);
    ctx.lineTo(0, 5000);
    ctx.stroke();

    ctx.restore();
  }

  /* =======================
     Círculo de Mohr
  ======================== */
  function drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.save();
    applyViewTransform(ctx);

    ctx.translate(resultsRef.current.sigmaP, 0);

    ctx.strokeStyle = "brown";
    ctx.lineWidth = 2 / scaleRef.current;

    ctx.beginPath();
    ctx.arc(0, 0, resultsRef.current.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /* =======================
     Diámetro principal
  ======================== */
  function drawBlue(ctx: CanvasRenderingContext2D) {
    const angle = resultsRef.current.doubleThetaP * (Math.PI / 180);

    ctx.save();
    applyViewTransform(ctx);
    ctx.translate(resultsRef.current.sigmaP, 0);
    ctx.rotate(angle);

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2 / scaleRef.current;

    ctx.beginPath();
    ctx.moveTo(-resultsRef.current.r, 0);
    ctx.lineTo(resultsRef.current.r, 0);
    ctx.stroke();

    ctx.restore();
  }

  /* =======================
     Diámetro τmax
  ======================== */
  function drawRed(ctx: CanvasRenderingContext2D) {
    const angle = resultsRef.current.doubleTheta * (Math.PI / 180);

    ctx.save();
    applyViewTransform(ctx);
    ctx.translate(resultsRef.current.sigmaP, 0);
    ctx.rotate(angle);

    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2 / scaleRef.current;

    ctx.beginPath();
    ctx.moveTo(-resultsRef.current.r, 0);
    ctx.lineTo(resultsRef.current.r, 0);
    ctx.stroke();

    ctx.restore();
  }

  /* =======================
     Redibujado
  ======================== */
  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx);
    drawAxes(ctx);
    drawCircle(ctx);
    drawBlue(ctx);
    drawRed(ctx);
    drawAngleArcs(ctx);
    drawPoints(ctx);
  }

  /* =======================
     Mouse: zoom + pan
  ======================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      scaleRef.current *= e.deltaY < 0 ? 1.1 : 0.9;
      draw();
    };

    const down = (e: MouseEvent) => {
      isPanningRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const move = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      offsetRef.current.x += e.clientX - lastMouseRef.current.x;
      offsetRef.current.y -= e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      draw();
    };

    const up = () => (isPanningRef.current = false);

    canvas.addEventListener("wheel", wheel);
    canvas.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  /* =======================
     Touch: pan + pinch zoom
  ======================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getDist = (t1: Touch, t2: Touch) =>
      Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

    const start = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastMouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
      if (e.touches.length === 2) {
        lastTouchDistRef.current = getDist(e.touches[0], e.touches[1]);
      }
    };

    const move = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1) {
        offsetRef.current.x += e.touches[0].clientX - lastMouseRef.current.x;
        offsetRef.current.y -= e.touches[0].clientY - lastMouseRef.current.y;
        lastMouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        draw();
      }

      if (e.touches.length === 2 && lastTouchDistRef.current) {
        const d = getDist(e.touches[0], e.touches[1]);
        scaleRef.current *= d / lastTouchDistRef.current;
        lastTouchDistRef.current = d;
        draw();
      }
    };

    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
    };
  }, []);

  /* =======================
     AutoAjuste al grafico
  ======================== */
  function autoFit() {
    const canvas = canvasRef.current!;
    const padding = 0.6 * Math.min(canvas.width, canvas.height);

    scaleRef.current = padding / (2 * results.r || 1);

    offsetRef.current = {
      x: -resultsRef.current.sigmaP * scaleRef.current,
      y: 0,
    };
  }
  useEffect(() => {
    resultsRef.current = results;
    autoFit();
    draw();
  }, [results]);

  /* =======================
     Reset de vista
  ======================== */
  const resetView = () => {
    resultsRef.current = results;
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    autoFit();
    draw();
  };

  // useEffect(draw, [results]);

  return (
    <div>
      <button className="reset" onClick={resetView}>
        Reset vista
      </button>
      <canvas ref={canvasRef} width={800} height={800} />
    </div>
  );
}
