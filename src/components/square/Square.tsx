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
    if (!ctx) return;

    const context = ctx;

    const width = canvas.width;
    const height = canvas.height;

    const centerX = 20;
    const centerY = height - 20;

    function applyTransform() {
      context?.translate(centerX, centerY);
    }

    function drawAxes() {
      context?.save();
      applyTransform();

      context.strokeStyle = "green";
      context.fillStyle = "green";
      context.lineWidth = 3;
      context?.beginPath();

      context?.moveTo(0, 0);
      context?.lineTo(width, 0);

      context?.moveTo(width - 35, centerX - 30);
      context?.lineTo(width - 20, 0);
      context?.lineTo(width - 35, 10);

      context?.moveTo(0, 0);
      context?.lineTo(0, -height);

      context?.moveTo(-10, -height + 40);
      context?.lineTo(centerX - 20, -height + 20);
      context?.lineTo(10, -height + 40);

      context?.stroke();
      context?.fill();
      context?.restore();
    }

    function drawSquare(size: number) {
      context?.save();
      applyTransform();
      context.fillStyle = "blue";
      context.fillRect(0, -size, size, size);
      context?.restore();

      // context.fillStyle = "red";
      // context.beginPath();
      // context.arc(centerX + x, centerY - y, 8, 0, 2 * Math.PI);
      // context.fill();
    }

    function drawArrowX(value: number) {
      if (value === 0) return;

      context?.save();
      applyTransform();

      const startX = 250;
      const startY = -125;
      const arrowLenght = 100;

      context.strokeStyle = value > 0 ? "red" : "orange";
      context.fillStyle = value > 0 ? "red" : "orange";
      context.lineWidth = 3;
      context?.beginPath();

      const direction = value > 0 ? 1 : -1;
      const endX = startX + direction * arrowLenght;

      context?.moveTo(startX + direction * 20, startY);
      context?.lineTo(endX, startY);

      const headSize = 10;
      context?.moveTo(endX - direction * headSize, startY - headSize);
      context?.lineTo(endX, startY);
      context?.lineTo(endX - direction * headSize, startY + headSize);
      context?.closePath();

      context?.stroke();
      context?.fill();
      context?.restore();
    }

    function drawArrowY(value: number) {
      if (value === 0) return;

      context?.save();
      applyTransform();

      const startX = 125;
      const startY = -250;
      const arrowLenght = 100;

      context.strokeStyle = value > 0 ? "red" : "orange";
      context.fillStyle = value > 0 ? "red" : "orange";
      context.lineWidth = 3;
      context?.beginPath();

      const direction = value > 0 ? -1 : 1;
      const endY = startY + direction * arrowLenght;

      context?.moveTo(startX, startY + direction * 20);
      context?.lineTo(startX, endY);

      const headSize = 10;
      context?.moveTo(startX, endY);
      context?.lineTo(startX + headSize, endY - direction * headSize);
      context?.lineTo(startX - headSize, endY - direction * headSize);
      context?.closePath();

      context?.stroke();
      context?.fill();
      context?.restore();
    }
    function drawArrowXY(value: number) {
      if (value === 0) return;

      context?.save();
      applyTransform();

      let startX = 125;
      let startY = -260;
      const arrowLenght = 100;

      context.strokeStyle = value > 0 ? "red" : "orange";
      context.fillStyle = value > 0 ? "red" : "orange";
      context.lineWidth = 3;
      context?.beginPath();

      let direction = value > 0 ? 1 : -1;
      const endX = startX + direction * arrowLenght;

      context?.moveTo(startX, startY);
      context?.lineTo(endX, startY);

      const headSize = 10;
      context?.moveTo(endX - direction * headSize, startY - headSize);
      context?.lineTo(endX, startY);
      context?.lineTo(endX - direction * headSize, startY + headSize);
      context?.closePath();

      startX = 260;
      startY = -125;
      direction = value > 0 ? -1 : 1;
      const endY = startY + direction * arrowLenght;

      context?.moveTo(startX, startY);
      context?.lineTo(startX, endY);

      context?.moveTo(startX, endY);
      context?.lineTo(startX + headSize, endY - direction * headSize);
      context?.lineTo(startX - headSize, endY - direction * headSize);
      context?.closePath();

      context?.stroke();
      context?.fill();
      context?.restore();
    }

    context.clearRect(0, 0, width, height);
    drawAxes();
    const squareSize = 250;
    drawSquare(squareSize);
    drawArrowX(Number(inputValueX));
    drawArrowY(Number(inputValueY));
    drawArrowXY(Number(inputValueXY));
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
