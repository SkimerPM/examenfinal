import { Routes, Route } from "react-router-dom";
import FacultadesList from "../pages/FacultadesList";
import CursosList from "../pages/CursosList";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<FacultadesList />} />
      <Route path="/cursos" element={<CursosList />} />
    </Routes>
  );    
}
