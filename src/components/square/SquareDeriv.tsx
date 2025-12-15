import { useEffect, useRef, useState } from "react";
import "./SquareAll.css";

export default function SquareDeriv({
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
    const rotateX = 230;
    const rotateY = height;
    const angle = -30 * (Math.PI / 180);

    function applyTransform() {
      context?.translate(rotateX, rotateY);
      context?.rotate(angle);
    }

    // function drawAxes() {
    //   context?.save();
    //   applyTransform();
    //
    //   context.strokeStyle = "green";
    //   context.fillStyle = "green";
    //   context.lineWidth = 3;
    //   context?.beginPath();
    //
    //   context?.moveTo(0, 0);
    //   context?.lineTo(width, 0);
    //
    //   context?.moveTo(width - rotateX + 35, -10);
    //   context?.lineTo(width - 171, 0);
    //   context?.lineTo(width - 195, 10);
    //
    //   context?.moveTo(0, 0);
    //   context?.lineTo(0, -height);
    //
    //   context?.moveTo(-10, -height + 170);
    //   context?.lineTo(0, -height + 140);
    //   context?.lineTo(10, -height + 170);
    //
    //   context?.stroke();
    //   context?.fill();
    //   context?.restore();
    // }

    function drawSquare(size: number) {
      context?.save();
      applyTransform();
      context.fillStyle = "blue";
      context.fillRect(0, -size, size, size);
      context?.restore();
    }

    function drawArrowX(value: number) {
      if (value === 0) return;

      context?.save();
      applyTransform();

      const leftX = 270;
      const arrowLenght = 100;
      const rightX = leftX + arrowLenght;
      const startY = -125;
      const headSize = 10;

      const startX = value > 0 ? leftX : rightX;
      const endX = value > 0 ? rightX : leftX;
      const direction = value > 0 ? 1 : -1;
      const color = value > 0 ? "lime" : "red";

      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = 3;

      context?.beginPath();

      context?.moveTo(startX, startY);
      context?.lineTo(endX, startY);

      context?.moveTo(endX, startY);
      context?.lineTo(endX - direction * headSize, startY - headSize);
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

      const upY = -370;
      const arrowLenght = 100;
      const downY = upY + arrowLenght;
      const startX = 125;
      const headSize = 10;

      const startY = value > 0 ? downY : upY;
      const endY = value > 0 ? upY : downY;
      const direction = value > 0 ? -1 : 1;
      const color = value > 0 ? "lime" : "red";

      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = 3;

      context?.beginPath();

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
    function drawArrowXY(value: number) {
      if (value === 0) return;

      context?.save();
      applyTransform();

      const leftX = 125;
      const arrowLenght = 100;
      const rightX = leftX + arrowLenght;
      const headSize = 10;
      let startY = -260;

      let startX = value > 0 ? leftX : rightX;
      const endX = value > 0 ? rightX : leftX;
      let direction = value > 0 ? 1 : -1;
      const color = value > 0 ? "lime" : "red";

      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = 3;

      context?.beginPath();

      context?.moveTo(startX, startY);
      context?.lineTo(endX, startY);

      context?.moveTo(endX - direction * headSize, startY - headSize);
      context?.lineTo(endX, startY);
      context?.lineTo(endX - direction * headSize, startY + headSize);
      context?.closePath();

      startX = 260;
      const upY = -200;
      const downY = upY + arrowLenght;
      direction = value > 0 ? -1 : 1;
      const endY = value > 0 ? upY : downY;
      startY = value > 0 ? downY : upY;

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
    // drawAxes();
    const squareSize = 250;
    drawSquare(squareSize);
    drawArrowX(Number(inputValueX));
    drawArrowY(Number(inputValueY));
    drawArrowXY(Number(inputValueXY));
  }, [inputValueX, inputValueY, inputValueXY]);

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
      <canvas ref={canvasRef} id="myCanvas" width="600" height="600"></canvas>
    </div>
  );
}
