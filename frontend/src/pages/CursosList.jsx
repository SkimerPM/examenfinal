// =================== CURSOSLIST ===================
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function CursosList() {
  const [cursos, setCursos] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [horario, setHorario] = useState("");
  const [creditos, setCreditos] = useState("");
  const [facultadId, setFacultadId] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setLoading(true);
    try {
      const [resCursos, resFacultades] = await Promise.all([
        api.get("cursos/"),
        api.get("facultades/"),
      ]);
      setCursos(resCursos.data);
      setFacultades(resFacultades.data);
      setError("");
    } catch {
      setError("No se pudo cargar cursos o facultades");
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("horario", horario);
      formData.append("creditos", creditos);
      formData.append("facultad", facultadId);
      if (imagen) formData.append("imagen", imagen);
      if (editId) {
        await api.put(`cursos/${editId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("cursos/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setNombre("");
      setHorario("");
      setCreditos("");
      setFacultadId("");
      setImagen(null);
      setEditId(null);
      await getData();
    } catch {
      setError("Error al guardar curso");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("¿Seguro que quieres eliminar este curso?")) {
      try {
        await api.delete(`cursos/${id}/`);
        setCursos(cursos.filter((c) => c.id !== id));
      } catch {
        setError("Error al eliminar curso");
      }
    }
  }

  function handleEdit(curso) {
    setNombre(curso.nombre);
    setHorario(curso.horario);
    setCreditos(curso.creditos);
    setFacultadId(curso.facultad);
    setImagen(null);
    setEditId(curso.id);
  }

  if (loading)
    return (
      <div className="mt-10 text-center text-cyan-600 animate-pulse">
        Cargando...
      </div>
    );
  if (error) return <div className="text-blue-700 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/25 backdrop-blur-xl border border-cyan-100 shadow-xl rounded-3xl p-8 sm:p-10 lg:p-14 transition-all">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-700 mb-8 font-mono tracking-tight text-center">
          Cursos
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center"
          encType="multipart/form-data"
        >
          <input
            type="text"
            required
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-cyan-200 bg-white/60 backdrop-blur-md p-3 px-4 rounded-lg w-full sm:w-44 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
          />
          <input
            type="text"
            required
            placeholder="Horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="border border-cyan-200 bg-white/60 p-3 px-4 rounded-lg w-full sm:w-44 focus:ring-2 focus:ring-cyan-400 transition"
          />
          <input
            type="number"
            required
            placeholder="Créditos"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
            className="border border-cyan-200 bg-white/60 p-3 px-4 rounded-lg w-full sm:w-32 focus:ring-2 focus:ring-cyan-400 transition"
          />
          <select
            required
            value={facultadId}
            onChange={(e) => setFacultadId(e.target.value)}
            className="border border-cyan-200 bg-white/70 p-3 px-4 rounded-lg w-full sm:w-44 focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option value="">Facultad...</option>
            {facultades.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="border border-cyan-200 bg-white/80 text-cyan-700 p-3 px-4 rounded-lg w-full sm:w-48"
          />
          <div className="flex gap-4">
            <button
              className="px-7 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 via-blue-400 to-indigo-500 text-white shadow hover:scale-105 hover:shadow-lg transition"
              type="submit"
            >
              {editId ? "Actualizar" : "Crear"}
            </button>
            {editId && (
              <button
                type="button"
                className="bg-cyan-100 text-cyan-700 px-5 py-3 rounded-lg hover:bg-cyan-200 transition"
                onClick={() => {
                  setNombre("");
                  setHorario("");
                  setCreditos("");
                  setFacultadId("");
                  setImagen(null);
                  setEditId(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        <ul className="divide-y divide-cyan-200 pt-6">
          {cursos.map((curso, idx) => (
            <li
              key={curso.id}
              className="py-6 flex flex-col sm:flex-row items-center justify-between animate-fadein gap-6 sm:gap-0"
              style={{
                animationDelay: `${idx * 70}ms`,
                animationName: "fadein",
                animationDuration: "0.4s",
                animationFillMode: "both",
                animationTimingFunction: "ease-out",
              }}
            >
              <span className="flex items-center gap-5 w-full">
                {curso.imagen && (
                  <img
                    src={
                      curso.imagen.startsWith("http")
                        ? curso.imagen
                        : `https://examenfinal-u1kw.onrender.com${curso.imagen}`
                    }
                    alt={curso.nombre}
                    className="h-16 w-16 object-cover rounded-xl border border-cyan-200 mr-2 shadow"
                    style={{ minWidth: "4rem" }}
                  />
                )}
                <span className="font-semibold text-gray-900 text-lg sm:text-xl mr-2 font-sans">
                  {curso.nombre}
                </span>
                <span className="text-neutral-500 mr-2">{curso.horario}</span>
                <span className="text-gray-700 mr-2">
                  Créditos: {curso.creditos}
                </span>
                <span className="text-cyan-600 font-mono">
                  /{facultades.find((f) => f.id === curso.facultad)?.nombre}
                </span>
              </span>
              <span className="flex gap-4 mt-4 sm:mt-0">
                <button
                  className="bg-cyan-600 text-white px-5 py-2 rounded-lg shadow border border-cyan-100 hover:bg-cyan-500 hover:scale-105 transition focus:outline-none focus:ring focus:ring-cyan-300"
                  onClick={() => handleEdit(curso)}
                >
                  Editar
                </button>
                <button
                  className="bg-white/70 text-cyan-600 px-5 py-2 rounded-lg border border-cyan-300 hover:bg-cyan-50 hover:scale-105 focus:outline-none focus:ring focus:ring-cyan-200 transition"
                  onClick={() => handleDelete(curso.id)}
                >
                  Eliminar
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
