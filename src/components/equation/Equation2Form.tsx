import { useMemo, useState } from "react";
import { matrix, lusolve } from "mathjs";
import { Square, SquareDerivAngle } from "../square";
import { PlotMohr, Results } from "../results";

const convert = (v: string) => (v === "" ? null : Number(v));
export default function Equation2Form() {
  const [sigmaX, setSigmaX] = useState("");
  const [sigmaY, setSigmaY] = useState("");
  const [tauXY, setSigmaXY] = useState("");
  const [sigmaXd, setSigmaXd] = useState("");
  const [sigmaYd, setSigmaYd] = useState("");
  const [tauXYd, setSigmaXYd] = useState("");
  const [theta, setTheta] = useState("");

  type Results = {
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
    doubleTheta: number;
    doubleThetaP: number;
    r: number;
  };

  const [results, setResults] = useState<Results | null>(null);

  const numericInputs = useMemo(
    () => ({
      sigmaX: convert(sigmaX),
      sigmaY: convert(sigmaY),
      tauXY: convert(tauXY),
      sigmaXd: convert(sigmaXd),
      sigmaYd: convert(sigmaYd),
      tauXYd: convert(tauXYd),
      theta: convert(theta),
    }),
    [sigmaX, sigmaY, tauXY, sigmaXd, sigmaYd, tauXYd, theta],
  );
  const toNumber = (n: number | null) => n ?? 0;

  function calcEquation() {
    const vars = {
      nSigmaX: toNumber(numericInputs.sigmaX),
      nSigmaY: toNumber(numericInputs.sigmaY),
      nTauXY: toNumber(numericInputs.tauXY),
      nSigmaXd: toNumber(numericInputs.sigmaXd),
      nSigmaYd: toNumber(numericInputs.sigmaYd),
      nTauXYd: toNumber(numericInputs.tauXYd),
      nTheta: toNumber(numericInputs.theta),
    };

    let { nSigmaX, nSigmaY, nTauXY, nSigmaXd, nSigmaYd, nTauXYd, nTheta } =
      vars;
    const aTheta = nTheta * (Math.PI / 180);
    const sin2 = Math.sin(2 * aTheta);
    const cos2 = Math.cos(2 * aTheta);
    const sinSquared = Math.pow(Math.sin(aTheta), 2);
    const cosSquared = Math.pow(Math.cos(aTheta), 2);
    if (sigmaX === "") {
      const cos3Pos = (1 + cos2) / 2;
      const cos3Neg = (1 - cos2) / 2;
      const aSigmaXd = nSigmaXd - nSigmaY * sinSquared;
      const aSigmaYd = nSigmaYd - nSigmaY * cos3Pos;
      const aTauXYd = nTauXYd - (nSigmaY / 2) * sin2;
      if (tauXY === "" && sigmaXd === "") {
        const A = matrix([
          [cos3Neg, -sin2],
          [-(sin2 / 2), cos2],
        ]);
        const b = matrix([aSigmaYd, aTauXYd]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nSigmaXd = nSigmaX * cosSquared + nTauXY * sin2 + nSigmaY * sinSquared;
      } else if (tauXY === "" && sigmaYd === "") {
        const A = matrix([
          [cosSquared, sin2],
          [-(sin2 / 2), cos2],
        ]);
        const b = matrix([aSigmaXd, aTauXYd]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nSigmaYd = nSigmaX * cos3Neg - nTauXY * sin2 + nSigmaY * cos3Pos;
      } else if (tauXY === "" && tauXYd === "") {
        const A = matrix([
          [cosSquared, sin2],
          [cos3Neg, -sin2],
        ]);
        const b = matrix([aSigmaXd, aSigmaYd]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nTauXYd = -(nSigmaX / 2) * sin2 + nTauXY * cos2 + (nSigmaY / 2) * sin2;
      } else if (sigmaY === "" && sigmaXd === "") {
        const A = matrix([
          [cos3Neg, cos3Pos],
          [-(sin2 / 2), sin2 / 2],
        ]);
        const b = matrix([nSigmaYd + nTauXY * sin2, nTauXYd - nTauXY * cos2]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nSigmaY = solution.get([1, 0]);
        nSigmaXd = nSigmaX * cosSquared + nTauXY * sin2 + nSigmaY * sinSquared;
      } else if (sigmaY === "" && sigmaYd === "") {
        const A = matrix([
          [cosSquared, sinSquared],
          [-(sin2 / 2), sin2 / 2],
        ]);
        const b = matrix([nSigmaXd - nTauXY * sin2, nTauXYd - nTauXY * cos2]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nSigmaY = solution.get([1, 0]);
        nSigmaYd = nSigmaX * cos3Neg - nTauXY * sin2 + nSigmaY * cos3Pos;
      } else if (sigmaY === "" && tauXYd === "") {
        const A = matrix([
          [cosSquared, sinSquared],
          [-(sin2 / 2), sin2 / 2],
        ]);
        const b = matrix([nSigmaXd - nTauXY * sin2, nTauXYd - nTauXY * cos2]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nTauXYd = -(nSigmaX / 2) * sin2 + nTauXY * cos2 + (nSigmaY / 2) * sin2;
      }
    } else if (sigmaY === "") {
      const cos3Pos = (1 + cos2) / 2;
      const cos3Neg = (1 - cos2) / 2;
      const aSigmaXd = nSigmaXd - nSigmaX * sinSquared;
      const aSigmaYd = nSigmaYd - nSigmaX * cos3Pos;
      const aTauXYd = nTauXYd + (nSigmaX / 2) * sin2;
      if (tauXY === "" && sigmaXd === "") {
        const A = matrix([
          [cos3Pos, -sin2],
          [sin2 / 2, cos2],
        ]);
        const b = matrix([aSigmaYd, aTauXYd]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nSigmaXd = nSigmaX * cosSquared + nTauXY * sin2 + nSigmaY * sinSquared;
      } else if (tauXY === "" && sigmaYd === "") {
        const A = matrix([
          [sinSquared, sin2],
          [sin2 / 2, cos2],
        ]);
        const b = matrix([aSigmaXd, aTauXYd]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nSigmaYd = nSigmaX * cos3Neg - nTauXY * sin2 + nSigmaY * cos3Pos;
      } else if (tauXY === "" && tauXYd === "") {
        const A = matrix([
          [sinSquared, sin2],
          [cos3Pos, -sin2],
        ]);
        const b = matrix([aSigmaXd, aSigmaYd]);
        const solution = lusolve(A, b);
        nSigmaX = solution.get([0, 0]);
        nTauXY = solution.get([1, 0]);
        nTauXYd = -(nSigmaX / 2) * sin2 + nTauXY * cos2 + (nSigmaY / 2) * sin2;
      }
    }
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
          onChangeXY={(v) => setSigmaXY(v)}
        />
        <SquareDerivAngle
          onChangeX={(v) => setSigmaXd(v)}
          onChangeY={(v) => setSigmaYd(v)}
          onChangeXY={(v) => setSigmaXYd(v)}
          onChangeTheta={(v) => setTheta(v)}
        />
      </div>
      <button
        className="calcular"
        type="submit"
        onClick={() => handleConfirm()}
      >
        {" "}
        calcular{" "}
      </button>
      {results && <Results results={results} />}
      {results && <PlotMohr results={results} />}
    </div>
  );
}
