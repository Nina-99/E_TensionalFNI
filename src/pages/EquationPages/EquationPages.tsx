import { useState } from "react";
import { Equation2Form, Equation1Form } from "../../components";
import civil from "../../assets/civil.jpeg";
import fni from "../../assets/fni.jpeg";

type FormType = "Equation1" | "Equation2";
export default function EquationPages() {
  const [selectedForm, setSelectedForm] = useState<FormType>("Equation1");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(event.target.value as FormType);
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "Equation1":
        return <Equation1Form />;
      case "Equation2":
        return <Equation2Form />;
      default:
        return <Equation1Form />;
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <img src={fni} alt="Icono" className="fni" />
      <img src={civil} alt="Icono" className="civil" />
      <h2 style={{ margin: "0" }}>Seleccionar Formulario</h2>

      <select
        value={selectedForm}
        onChange={handleSelectChange}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
      >
        <option value="Equation1">Fórmula de Esfuerzos sin Angulo</option>
        <option value="Equation2">Fórmula de Esfuerzos con Angulo</option>
      </select>
      <p className="univ-name">Univ. Nina Nuñez Avel</p>

      <hr />

      {renderForm()}
      <footer
        style={{
          textAlign: "center",
          padding: "10px",
          opacity: 0.8,
          color: "#fc4b08",
        }}
      >
        © {new Date().getFullYear()} NINAdev — Todos los derechos reservados.
      </footer>
    </div>
  );
}
