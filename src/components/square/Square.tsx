import { useEffect, useRef, useState } from "react";
import "./SquareAll.css";

export default function Square({
  onChangeX,
  onChangeY,
  onChangeXY,
}: {
  onChangeX: (v: string) => void;
  onChangeY: (v: string) => void;
  onChangeXY: (v: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputValueX, setInputValueX] = useState("");
  const [inputValueY, setInputValueY] = useState("");
  const [inputValueXY, setInputValueXY] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      const width = canvas.width;
      const height = canvas.height;

      const centerX = 20;
      const centerY = height - 20;

      function applyTransform() {
        ctx?.translate(centerX, centerY);
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

        ctx?.moveTo(width - 35, centerX - 30);
        ctx?.lineTo(width - 20, 0);
        ctx?.lineTo(width - 35, 10);

        ctx?.moveTo(0, 0);
        ctx?.lineTo(0, -height);

        ctx?.moveTo(-10, -height + 40);
        ctx?.lineTo(centerX - 20, -height + 20);
        ctx?.lineTo(10, -height + 40);

        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
      }

      function drawSquare(size: number) {
        ctx?.save();
        applyTransform();
        ctx.fillStyle = "blue";
        ctx.fillRect(0, -size, size, size);
        ctx?.restore();

        // ctx.fillStyle = "red";
        // ctx.beginPath();
        // ctx.arc(centerX + x, centerY - y, 8, 0, 2 * Math.PI);
        // ctx.fill();
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
      drawSquare(squareSize);
      drawArrowX(Number(inputValueX));
      drawArrowY(Number(inputValueY));
      drawArrowXY(Number(inputValueXY));
    }
  }, [inputValueX, inputValueY, inputValueXY]);
  return (
    <div className="canvas-wrapper">
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
        step="0.1"
        onChange={(e) => {
          const value = e.target.value || "";
          setInputValueY(value);
          onChangeY(value);
        }}
      />
      <input
        className="inputXY"
        type="text"
        step="0.1"
        onChange={(e) => {
          const value = e.target.value || "";
          setInputValueXY(value);
          onChangeXY(value);
        }}
      />
      <canvas ref={canvasRef} id="myCanvas" width="400" height="400"></canvas>
    </div>
  );
}
