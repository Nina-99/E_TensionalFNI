import { useEffect, useRef, useState } from "react";
import "./SquareAll.css";

export default function SquareDerivAngle({
  onChangeX,
  onChangeY,
  onChangeXY,
  onChangeTheta,
}: {
  onChangeX: (v: string) => void;
  onChangeY: (v: string) => void;
  onChangeXY: (v: string) => void;
  onChangeTheta: (v: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputValueX, setInputValueX] = useState("");
  const [inputValueY, setInputValueY] = useState("");
  const [inputValueXY, setInputValueXY] = useState("");
  const [inputValueTheta, setInputValueTheta] = useState("");
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      const width = canvas.width;
      const height = canvas.height;
      const rotateX = 230;
      const rotateY = height;
      const angle = -30 * (Math.PI / 180);
      ctx.clearRect(0, 0, width, height);

      function applyTransform() {
        ctx?.translate(rotateX, rotateY);
        ctx?.rotate(angle);
      }

      function drawAxes() {
        ctx?.save();
        applyTransform();

        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
        ctx.lineWidth = 3;
        ctx?.beginPath();

        ctx?.moveTo(0, 0);
        ctx?.lineTo(width, 0);

        ctx?.moveTo(width - rotateX + 35, -10);
        ctx?.lineTo(width - 171, 0);
        ctx?.lineTo(width - 195, 10);

        ctx?.moveTo(0, 0);
        ctx?.lineTo(0, -height);

        ctx?.moveTo(-10, -height + 170);
        ctx?.lineTo(0, -height + 140);
        ctx?.lineTo(10, -height + 170);

        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
      }

      function drawSquare(x: number, y: number, size: number) {
        ctx?.save();
        applyTransform();
        ctx.fillStyle = "blue";
        ctx.fillRect(0, -size, size, size);
        ctx?.restore();
      }
      function drawAngle() {
        ctx?.save();
        const radio = 100;
        ctx?.translate(20, 0);
        ctx?.rotate(angle);
        ctx.strokeStyle = "magenta";
        ctx.lineWidth = 3;
        ctx?.beginPath();
        ctx.arc(0, 630, radio, 0, Math.PI / 2);

        ctx?.rotate(-angle);
        ctx?.moveTo(210, height);
        ctx?.lineTo(width, height);
        ctx?.stroke();

        ctx.font = "28px Arial";
        ctx.fillStyle = "magenta";
        ctx.fillText("Θ = ", 420, height - 50);
        ctx?.restore();
      }

      function drawArrowX(value: number) {
        if (value === 0) return;

        ctx?.save();
        applyTransform();

        const startX = 250;
        const startY = -125;
        const arrowLenght = 100;

        ctx.strokeStyle = value > 0 ? "red" : "orange";
        ctx.fillStyle = value > 0 ? "red" : "orange";
        ctx.lineWidth = 3;
        ctx?.beginPath();

        const direction = value > 0 ? 1 : -1;
        const endX = startX + direction * arrowLenght;

        ctx?.moveTo(startX + direction * 20, startY);
        ctx?.lineTo(endX, startY);

        const headSize = 10;
        ctx?.moveTo(endX - direction * headSize, startY - headSize);
        ctx?.lineTo(endX, startY);
        ctx?.lineTo(endX - direction * headSize, startY + headSize);
        ctx?.closePath();

        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
      }

      function drawArrowY(value: number) {
        if (value === 0) return;

        ctx?.save();
        applyTransform();

        const startX = 125;
        const startY = -250;
        const arrowLenght = 100;

        ctx.strokeStyle = value > 0 ? "red" : "orange";
        ctx.fillStyle = value > 0 ? "red" : "orange";
        ctx.lineWidth = 3;
        ctx?.beginPath();

        const direction = value > 0 ? -1 : 1;
        const endY = startY + direction * arrowLenght;

        ctx?.moveTo(startX, startY + direction * 20);
        ctx?.lineTo(startX, endY);

        const headSize = 10;
        ctx?.moveTo(startX, endY);
        ctx?.lineTo(startX + headSize, endY - direction * headSize);
        ctx?.lineTo(startX - headSize, endY - direction * headSize);
        ctx?.closePath();

        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
      }
      function drawArrowXY(value: number) {
        if (value === 0) return;

        ctx?.save();
        applyTransform();

        let startX = 125;
        let startY = -260;
        const arrowLenght = 100;

        ctx.strokeStyle = value > 0 ? "red" : "orange";
        ctx.fillStyle = value > 0 ? "red" : "orange";
        ctx.lineWidth = 3;
        ctx?.beginPath();

        let direction = value > 0 ? 1 : -1;
        const endX = startX + direction * arrowLenght;

        ctx?.moveTo(startX, startY);
        ctx?.lineTo(endX, startY);

        const headSize = 10;
        ctx?.moveTo(endX - direction * headSize, startY - headSize);
        ctx?.lineTo(endX, startY);
        ctx?.lineTo(endX - direction * headSize, startY + headSize);
        ctx?.closePath();

        startX = 260;
        startY = -125;
        direction = value > 0 ? -1 : 1;
        const endY = startY + direction * arrowLenght;

        ctx?.moveTo(startX, startY);
        ctx?.lineTo(startX, endY);

        ctx?.moveTo(startX, endY);
        ctx?.lineTo(startX + headSize, endY - direction * headSize);
        ctx?.lineTo(startX - headSize, endY - direction * headSize);
        ctx?.closePath();

        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
      }

      ctx.clearRect(0, 0, width, height);
      drawAxes();
      const squareSize = 250;
      const squareCenterX = 50;
      const squareCenterY = 50;
      drawSquare(squareCenterX, squareCenterY, squareSize);
      drawAngle();
      drawArrowX(Number(inputValueX));
      drawArrowY(Number(inputValueY));
      drawArrowXY(Number(inputValueXY));
    }
  }, [inputValueX, inputValueY, inputValueXY, inputValueTheta]);

  return (
    <div className="canvas-wrapper-deriv">
      <input
        className="inputX"
        type="text"
        onChange={(e) => {
          const value = e.target.value || "";
          setInputValueX(value);
          onChangeX(value);
        }}
      />
      <input
        className="inputY"
        type="text"
        onChange={(e) => {
          const value = e.target.value || "";
          setInputValueY(value);
          onChangeY(value);
        }}
      />
      <input
        className="inputXY"
        type="text"
        onChange={(e) => {
          const value = e.target.value || "";
          setInputValueXY(value);
          onChangeXY(value);
        }}
      />
      <input
        className="inputTheta"
        type="text"
        onChange={(e) => {
          const value = e.target.value || "";
          setInputValueTheta(value);
          onChangeTheta(value);
        }}
      />
      <canvas ref={canvasRef} id="myCanvas" width="600" height="600"></canvas>
    </div>
  );
}
