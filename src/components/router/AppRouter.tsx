import { Routes, Route } from "react-router-dom";
import { EquationPages } from "../../pages";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<EquationPages />} />
    </Routes>
  );
}

export default AppRouter;
