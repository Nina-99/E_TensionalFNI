import { useEffect, useRef } from "react";

type MohrResults = {
  nSigmaX: number;
  nSigmaY: number;
  nTauXY: number;
  nSigmaXd: number;
  nSigmaYd: number;
  nTauXYd: number;
  sigmaP: number;
  sigmaD: number;
  sigmaDd: number;
  sigma1: number;
  sigma2: number;
  tauMax: number;
  thetaP: number;
  theta: number;
  doubleThetaP: number;
  doubleTheta: number;
  r: number;
};

export default function PlotMohr({ results }: { results: MohrResults }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      const width = canvas.width;
      const height = canvas.height;

      const centerAxesX = width / 2;
      const centerAxesY = height / 2;
      const centerCircleX = width / 2 + Number(results.sigmaP.toFixed(2));

      ctx.clearRect(0, 0, width, height);

      const maxStressCoord = Math.max(Math.abs(Number(results.r)));
      const viewRadius = Math.min(centerCircleX, centerAxesY) * 0.45;

      const scale = maxStressCoord === 0 ? 1 : viewRadius / maxStressCoord;
      function drawAxes() {
        const startX = -centerAxesX;
        const startY = -centerAxesY;
        ctx?.save();
        ctx?.translate(centerAxesX, centerAxesY);
        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
        ctx.lineWidth = 3;
        ctx?.beginPath();

        ctx?.moveTo(startX, 0);
        ctx?.lineTo(width, 0);

        ctx?.moveTo(startX + 10, 10);
        ctx?.lineTo(startX, 0);
        ctx?.lineTo(startX + 10, -10);
        ctx?.moveTo(centerAxesX - 10, 10);
        ctx?.lineTo(centerAxesX, 0);
        ctx?.lineTo(centerAxesX - 10, -10);

        ctx?.moveTo(0, startY);
        ctx?.lineTo(0, height);

        ctx?.moveTo(10, startY + 10);
        ctx?.lineTo(0, startY);
        ctx?.lineTo(-10, startY + 10);
        ctx?.moveTo(10, centerAxesY - 10);
        ctx?.lineTo(0, centerAxesY);
        ctx?.lineTo(-10, centerAxesY - 10);
        ctx.font = "20px Arial";
        ctx.fillText("σ", centerAxesX - 20, -10);
        ctx.fillText("τ", 15, -centerAxesY + 20);

        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
      }
      function applyTransform() {
        ctx?.translate(
          width / 2 + Number(results.sigmaP.toFixed(2)) * scale,
          centerAxesY,
        );
      }
      const radio = Number(results.r) * scale;
      function drawCircle() {
        ctx?.save();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        applyTransform();
        ctx?.beginPath();
        ctx.arc(0, 0, radio, 0, 2 * Math.PI);
        ctx?.stroke();
        ctx?.restore();
      }
      function drawBlue() {
        const angle =
          -Number(results.doubleThetaP.toFixed(2)) * (Math.PI / 180);
        ctx?.save();
        applyTransform();
        ctx?.rotate(angle);
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
        ctx.lineWidth = 3;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx?.beginPath();

        ctx?.moveTo(-radio, 0);
        ctx?.lineTo(radio, 0);

        ctx?.stroke();
        ctx?.rotate(-angle);
        let textX = Math.cos(angle) * (radio / 2);
        let textY = Math.sin(angle) * (radio / 4);
        ctx?.fillText(`${results.doubleThetaP.toFixed(2)}°`, textX, textY);
        if (angle > 0) {
          textX = Math.cos(angle) * (-radio - 10);
          textY = Math.sin(angle) * (-radio - 10);
        } else {
          textX = Math.cos(angle) * (radio + 10);
          textY = Math.sin(angle) * (radio + 10);
        }
        ctx?.fillText(`σ_max = ${results.sigma1.toFixed(2)}`, textX, textY);
        if (angle > 0) {
          textX = Math.cos(angle) * (radio + 10);
          textY = Math.sin(angle) * (radio + 10);
        } else {
          textX = Math.cos(angle) * (-radio - 10);
          textY = Math.sin(angle) * (-radio - 10);
        }
        // textX = Math.cos(angle) * (radio + 10);
        // textY = Math.sin(angle) * (radio + 10);
        ctx?.fillText(`σ_min = ${results.sigma2.toFixed(2)}`, textX, textY);
        ctx?.fill();
        ctx?.restore();
      }
      function drawRed() {
        const angle = -Number(results.doubleTheta.toFixed(2)) * (Math.PI / 180);
        ctx?.save();
        applyTransform();
        ctx?.rotate(angle);
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.lineWidth = 3;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx?.beginPath();

        ctx?.moveTo(-radio, 0);
        ctx?.lineTo(radio, 0);
        ctx?.stroke();
        ctx?.rotate(-angle);
        let textX = Math.cos(angle) * (radio / 2);
        let textY = Math.sin(angle) * (radio / 4);
        ctx?.fillText(`${results.doubleTheta.toFixed(2)}°`, textX, textY);
        if (angle > 0) {
          textX = Math.cos(angle) * (-radio - 10);
          textY = Math.sin(angle) * (-radio - 10);
        } else {
          textX = Math.cos(angle) * (radio + 10);
          textY = Math.sin(angle) * (radio + 10);
        }
        ctx?.fillText(`τ_max = ${results.tauMax.toFixed(2)}`, textX, textY);
        ctx?.fill();
        ctx?.restore();
      }
      ctx.clearRect(0, 0, width, height);
      drawAxes();
      drawCircle();
      drawBlue();
      drawRed();
    }
  });
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Gráfico del Círculo de Mohr</h3>
      <div className="data-results">
        <p>
          <strong>
            σ<sub>x</sub>=
          </strong>{" "}
          {results.nSigmaX.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>y</sub>=
          </strong>{" "}
          {results.nSigmaY.toFixed(2)}
        </p>
        <p>
          <strong>
            τ<sub>xy</sub>=
          </strong>{" "}
          {results.nTauXY.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>x</sub>'=
          </strong>{" "}
          {results.nSigmaXd.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>y</sub>'=
          </strong>{" "}
          {results.nSigmaYd.toFixed(2)}
        </p>
        <p>
          <strong>
            τ<sub>xy</sub>'=
          </strong>{" "}
          {results.nTauXYd.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>p</sub>=
          </strong>{" "}
          {results.sigmaP.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>d</sub>=
          </strong>{" "}
          {results.sigmaD.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>d</sub>'=
          </strong>{" "}
          {results.sigmaDd.toFixed(2)}
        </p>
        <p>
          <strong>radio= </strong> {results.r.toFixed(2)}
        </p>
        <p>
          <strong>θ=</strong> {results.theta.toFixed(2)}°
        </p>
        <p>
          <strong>
            θ<sub>p</sub>=
          </strong>{" "}
          {results.thetaP.toFixed(2)}°
        </p>
        <p>
          <strong>
            σ<sub>1</sub>=
          </strong>{" "}
          {results.sigma1.toFixed(2)}
        </p>
        <p>
          <strong>
            σ<sub>2</sub>=
          </strong>{" "}
          {results.sigma2.toFixed(2)}
        </p>
        <p>
          <strong>
            τ<sub>max</sub>=
          </strong>{" "}
          {results.tauMax.toFixed(2)}
        </p>
      </div>
      <canvas ref={canvasRef} id="myCanvas" width="800" height="800"></canvas>
    </div>
  );
}
