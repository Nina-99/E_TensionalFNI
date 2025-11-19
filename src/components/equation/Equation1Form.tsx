import { useMemo, useState } from "react";
import { PlotMohr, Square, SquareDeriv } from "../square";

const convert = (v: string) => (v === "" ? null : Number(v));
export default function Equation1Form() {
  const [x, setSigmaX] = useState("");
  const [y, setSigmaY] = useState("");
  const [xy, setTauXY] = useState("");
  const [dx, setSigmaXd] = useState("");
  const [dy, setSigmaYd] = useState("");
  const [dxy, setTauXYd] = useState("");

  const [results, setResults] = useState(null);

  const numericInputs = useMemo(
    () => ({
      x: convert(x),
      y: convert(y),
      xy: convert(xy),
      dx: convert(dx),
      dy: convert(dy),
      dxy: convert(dxy),
    }),
    [x, y, xy, dx, dy, dxy],
  );
  let {
    x: nSigmaX,
    y: nSigmaY,
    xy: nTauXY,
    dx: nSigmaXd,
    dy: nSigmaYd,
    dxy: nTauXYd,
  } = numericInputs;
  function calcEquation() {
    if (x === "") {
      // if (nSigmaY === null || nSigmaXd === null || nSigmaYd === null) return;
      nSigmaX = nSigmaXd + nSigmaYd - nSigmaY;
      if (xy !== "" && dxy !== "") {
        if (x === "") {
          if (dx === "") {
            nSigmaX =
              (Math.pow(nTauXY, 2) - Math.pow(nTauXYd, 2)) /
                (nSigmaY - nSigmaYd) +
              nSigmaYd;
            nSigmaXd = nSigmaX + nSigmaY - nSigmaYd;
          } else {
            nSigmaX =
              (Math.pow(nTauXY, 2) - Math.pow(nTauXYd, 2)) /
                (nSigmaY - nSigmaXd) +
              nSigmaXd;
            nSigmaYd = nSigmaX + nSigmaY - nSigmaXd;
          }
        } else {
          if (dx === "") {
            nSigmaY =
              (Math.pow(nTauXY, 2) - Math.pow(nTauXYd, 2)) /
                (nSigmaX - nSigmaYd) +
              nSigmaYd;
            nSigmaXd = nSigmaX + nSigmaY - nSigmaYd;
          } else {
            nSigmaY =
              (Math.pow(nTauXY, 2) - Math.pow(nTauXYd, 2)) /
                (nSigmaX - nSigmaXd) +
              nSigmaXd;
            nSigmaYd = nSigmaX + nSigmaY - nSigmaXd;
          }
        }
      } else if (xy === "") {
        if (nTauXYd === null) return;
        nTauXY = -Math.sqrt(
          (nSigmaXd - nSigmaY) * (nSigmaY - nSigmaYd) + Math.pow(nTauXYd, 2),
        );
      } else {
        if (nTauXY === null) return;
        nTauXYd = -Math.sqrt(
          Math.pow(nTauXY, 2) - (nSigmaXd + nSigmaY) * (nSigmaY - nSigmaYd),
        );
      }
    } else if (y === "") {
      if (nSigmaX === null || nSigmaXd === null || nSigmaYd === null) return;
      nSigmaY = nSigmaXd + nSigmaYd - nSigmaX;
      if (xy === "") {
        if (nTauXYd === null) return;
        nTauXY = -Math.sqrt(
          (nSigmaYd - nSigmaX) * (nSigmaX - nSigmaXd) + Math.pow(nTauXYd, 2),
        );
      } else {
        if (nTauXY === null) return;
        nTauXYd = -Math.sqrt(
          Math.pow(nTauXY, 2) - (nSigmaYd - nSigmaX) * (nSigmaX - nSigmaXd),
        );
      }
    } else if (dx === "") {
      if (nSigmaX === null || nSigmaY === null || nSigmaYd === null) return;
      nSigmaXd = nSigmaX + nSigmaY - nSigmaYd;
      if (xy === "") {
        if (nTauXYd === null) return;
        nTauXY = -Math.sqrt(
          (nSigmaX - nSigmaYd) * (nSigmaY - nSigmaYd) + Math.pow(nTauXYd, 2),
        );
      } else {
        if (nTauXY === null) return;
        nTauXYd = -Math.sqrt(
          Math.pow(nTauXY, 2) - (nSigmaX - nSigmaYd) * (nSigmaY - nSigmaYd),
        );
      }
    } else if (dy === "") {
      if (nSigmaX === null || nSigmaY === null || nSigmaXd === null) return;
      nSigmaYd = nSigmaX + nSigmaY - nSigmaXd;
      if (xy === "") {
        if (nTauXYd === null) return;
        nTauXY = -Math.sqrt(
          (nSigmaY - nSigmaXd) * (nSigmaX - nSigmaXd) + Math.pow(nTauXYd, 2),
        );
      } else {
        if (nTauXY === null) return;
        nTauXYd = -Math.sqrt(
          Math.pow(nTauXY, 2) - (nSigmaY - nSigmaXd) * (nSigmaX - nSigmaXd),
        );
      }
    }

    if (
      nSigmaX === null ||
      nSigmaY === null ||
      nTauXY === null ||
      nSigmaXd === null ||
      nSigmaYd === null ||
      nTauXYd === null
    )
      return;
    const sigmaP = (nSigmaX + nSigmaY) / 2;
    const sigmaD = (nSigmaX - nSigmaY) / 2;
    const sigmaDd = (nSigmaXd - nSigmaYd) / 2;
    const r = Math.sqrt(Math.pow(sigmaD, 2) + Math.pow(nTauXY, 2));
    const theta =
      (Math.acos((nTauXY * nTauXYd + sigmaD * sigmaDd) / Math.pow(r, 2)) / 2) *
      (180 / Math.PI);
    const doubleTheta = 2 * theta;
    const sigma1 = sigmaP + r;
    const sigma2 = sigmaP - r;
    const thetaP = (Math.atan(nTauXY / sigmaD) / 2) * (180 / Math.PI);
    const doubleThetaP = 2 * thetaP;
    const tauMax = r;
    setResults({
      nSigmaX,
      nSigmaY,
      nTauXY,
      nSigmaXd,
      nSigmaYd,
      nTauXYd,
      sigmaP,
      sigmaD,
      sigmaDd,
      sigma1,
      sigma2,
      tauMax,
      thetaP,
      theta,
      doubleTheta,
      doubleThetaP,
      r,
    });
  }

  const handleConfirm = () => {
    calcEquation();
  };

  return (
    <div>
      <div className="squared">
        <Square
          onChangeX={(v) => setSigmaX(v)}
          onChangeY={(v) => setSigmaY(v)}
          onChangeXY={(v) => setTauXY(v)}
        />
        <SquareDeriv
          onChangeX={(v) => setSigmaXd(v)}
          onChangeY={(v) => setSigmaYd(v)}
          onChangeXY={(v) => setTauXYd(v)}
        />
      </div>
      <br />
      <button
        className="calcular"
        type="submit"
        onClick={() => handleConfirm()}
      >
        {" "}
        calcular{" "}
      </button>
      {results && <PlotMohr results={results} />}
    </div>
  );
}
