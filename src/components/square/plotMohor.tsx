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
    if (!ctx) return;

    const context = ctx;

    const width = canvas.width;
    const height = canvas.height;

    const centerAxesX = width / 2;
    const centerAxesY = height / 2;
    const centerCircleX = width / 2 + Number(results.sigmaP.toFixed(2));

    context.clearRect(0, 0, width, height);

    const maxStressCoord = Math.max(Math.abs(Number(results.r)));
    const viewRadius = Math.min(centerCircleX, centerAxesY) * 0.45;

    const scale = maxStressCoord === 0 ? 1 : viewRadius / maxStressCoord;
    function drawAxes() {
      const startX = -centerAxesX;
      const startY = -centerAxesY;
      context?.save();
      context?.translate(centerAxesX, centerAxesY);
      context.strokeStyle = "green";
      context.fillStyle = "green";
      context.lineWidth = 3;
      context?.beginPath();

      context?.moveTo(startX, 0);
      context?.lineTo(width, 0);

      context?.moveTo(startX + 10, 10);
      context?.lineTo(startX, 0);
      context?.lineTo(startX + 10, -10);
      context?.moveTo(centerAxesX - 10, 10);
      context?.lineTo(centerAxesX, 0);
      context?.lineTo(centerAxesX - 10, -10);

      context?.moveTo(0, startY);
      context?.lineTo(0, height);

      context?.moveTo(10, startY + 10);
      context?.lineTo(0, startY);
      context?.lineTo(-10, startY + 10);
      context?.moveTo(10, centerAxesY - 10);
      context?.lineTo(0, centerAxesY);
      context?.lineTo(-10, centerAxesY - 10);
      context.font = "20px Arial";
      context.fillText("σ", centerAxesX - 20, -10);
      context.fillText("τ", 15, -centerAxesY + 20);

      context?.stroke();
      context?.fill();
      context?.restore();
    }
    function applyTransform() {
      context?.translate(
        width / 2 + Number(results.sigmaP.toFixed(2)) * scale,
        centerAxesY,
      );
    }
    const radio = Number(results.r) * scale;
    function drawCircle() {
      context?.save();
      context.strokeStyle = "yellow";
      context.lineWidth = 3;
      applyTransform();
      context?.beginPath();
      context.arc(0, 0, radio, 0, 2 * Math.PI);
      context?.stroke();
      context?.restore();
    }
    function drawBlue() {
      const angle = -Number(results.doubleThetaP.toFixed(2)) * (Math.PI / 180);
      context?.save();
      applyTransform();
      context?.rotate(angle);
      context.strokeStyle = "blue";
      context.fillStyle = "blue";
      context.lineWidth = 3;
      context.font = "20px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context?.beginPath();

      context?.moveTo(-radio, 0);
      context?.lineTo(radio, 0);

      context?.stroke();
      context?.rotate(-angle);
      let textX = Math.cos(angle) * (radio / 2);
      let textY = Math.sin(angle) * (radio / 4);
      context?.fillText(`${results.doubleThetaP.toFixed(2)}°`, textX, textY);
      if (angle > 0) {
        textX = Math.cos(angle) * (-radio - 10);
        textY = Math.sin(angle) * (-radio - 10);
      } else {
        textX = Math.cos(angle) * (radio + 10);
        textY = Math.sin(angle) * (radio + 10);
      }
      context?.fillText(`σ_max = ${results.sigma1.toFixed(2)}`, textX, textY);
      if (angle > 0) {
        textX = Math.cos(angle) * (radio + 10);
        textY = Math.sin(angle) * (radio + 10);
      } else {
        textX = Math.cos(angle) * (-radio - 10);
        textY = Math.sin(angle) * (-radio - 10);
      }
      // textX = Math.cos(angle) * (radio + 10);
      // textY = Math.sin(angle) * (radio + 10);
      context?.fillText(`σ_min = ${results.sigma2.toFixed(2)}`, textX, textY);
      context?.fill();
      context?.restore();
    }
    function drawRed() {
      const angle = -Number(results.doubleTheta.toFixed(2)) * (Math.PI / 180);
      context?.save();
      applyTransform();
      context?.rotate(angle);
      context.strokeStyle = "red";
      context.fillStyle = "red";
      context.lineWidth = 3;
      context.font = "20px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context?.beginPath();

      context?.moveTo(-radio, 0);
      context?.lineTo(radio, 0);
      context?.stroke();
      context?.rotate(-angle);
      let textX = Math.cos(angle) * (radio / 2);
      let textY = Math.sin(angle) * (radio / 4);
      context?.fillText(`${results.doubleTheta.toFixed(2)}°`, textX, textY);
      if (angle > 0) {
        textX = Math.cos(angle) * (-radio - 10);
        textY = Math.sin(angle) * (-radio - 10);
      } else {
        textX = Math.cos(angle) * (radio + 10);
        textY = Math.sin(angle) * (radio + 10);
      }
      context?.fillText(`τ_max = ${results.tauMax.toFixed(2)}`, textX, textY);
      context?.fill();
      context?.restore();
    }
    context.clearRect(0, 0, width, height);
    drawAxes();
    drawCircle();
    drawBlue();
    drawRed();
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
