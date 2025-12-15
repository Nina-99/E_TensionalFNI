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

export default function Results({ results }: { results: MohrResults }) {
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
    </div>
  );
}
