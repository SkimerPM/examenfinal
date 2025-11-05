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
  if (error)
    return <div className="text-blue-700 text-center mt-10 px-4">{error}</div>;

  return (
    <div className="w-full min-h-screen px-3 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/25 backdrop-blur-xl border border-cyan-100 shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 transition-all">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-700 mb-6 sm:mb-8 font-mono tracking-tight text-center">
            Cursos
          </h1>

          {/* Formulario responsive con grid */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 sm:mb-8"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <input
                type="text"
                required
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border border-cyan-200 bg-white/60 backdrop-blur-md p-3 px-4 rounded-lg w-full focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-sm sm:text-base"
              />
              <input
                type="text"
                required
                placeholder="Horario"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="border border-cyan-200 bg-white/60 p-3 px-4 rounded-lg w-full focus:ring-2 focus:ring-cyan-400 transition text-sm sm:text-base"
              />
              <input
                type="number"
                required
                placeholder="Créditos"
                value={creditos}
                onChange={(e) => setCreditos(e.target.value)}
                className="border border-cyan-200 bg-white/60 p-3 px-4 rounded-lg w-full focus:ring-2 focus:ring-cyan-400 transition text-sm sm:text-base"
              />
              <select
                required
                value={facultadId}
                onChange={(e) => setFacultadId(e.target.value)}
                className="border border-cyan-200 bg-white/70 p-3 px-4 rounded-lg w-full focus:ring-2 focus:ring-cyan-400 transition text-sm sm:text-base sm:col-span-2 lg:col-span-1"
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
                className="border border-cyan-200 bg-white/80 text-cyan-700 p-2.5 px-4 rounded-lg w-full text-sm sm:text-base sm:col-span-2 lg:col-span-2"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
              <button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 via-blue-400 to-indigo-500 text-white shadow hover:scale-105 hover:shadow-lg transition active:scale-95"
                type="submit"
              >
                {editId ? "Actualizar" : "Crear"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="w-full sm:w-auto bg-cyan-100 text-cyan-700 px-6 sm:px-8 py-3 rounded-lg hover:bg-cyan-200 transition active:scale-95"
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

          {/* Lista de cursos */}
          <ul className="divide-y divide-cyan-200 pt-4 sm:pt-6">
            {cursos.map((curso, idx) => (
              <li
                key={curso.id}
                className="py-4 sm:py-6 animate-fadein"
                style={{
                  animationDelay: `${idx * 70}ms`,
                  animationName: "fadein",
                  animationDuration: "0.4s",
                  animationFillMode: "both",
                  animationTimingFunction: "ease-out",
                }}
              >
                {/* Tarjeta de curso responsive */}
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Contenido del curso */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {curso.imagen && (
                      <img
                        src={
                          curso.imagen.startsWith("http")
                            ? curso.imagen
                            : `https://examenfinal-u1kw.onrender.com${curso.imagen}`
                        }
                        alt={curso.nombre}
                        className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-xl border border-cyan-200 shadow flex-shrink-0"
                      />
                    )}

                    {/* Información del curso - stack en móvil */}
                    <div className="flex flex-col gap-1 sm:gap-2 min-w-0 flex-1">
                      <span className="font-semibold text-gray-900 text-base sm:text-lg font-sans truncate">
                        {curso.nombre}
                      </span>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm">
                        <span className="text-neutral-500">
                          {curso.horario}
                        </span>
                        <span className="text-gray-700">
                          Créditos: {curso.creditos}
                        </span>
                        <span className="text-cyan-600 font-mono truncate">
                          /
                          {
                            facultades.find((f) => f.id === curso.facultad)
                              ?.nombre
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    <button
                      className="flex-1 sm:flex-none bg-cyan-600 text-white px-4 sm:px-5 py-2 rounded-lg shadow border border-cyan-100 hover:bg-cyan-500 hover:scale-105 transition focus:outline-none focus:ring focus:ring-cyan-300 active:scale-95 text-sm sm:text-base min-w-[80px]"
                      onClick={() => handleEdit(curso)}
                    >
                      Editar
                    </button>
                    <button
                      className="flex-1 sm:flex-none bg-white/70 text-cyan-600 px-4 sm:px-5 py-2 rounded-lg border border-cyan-300 hover:bg-cyan-50 hover:scale-105 focus:outline-none focus:ring focus:ring-cyan-200 transition active:scale-95 text-sm sm:text-base min-w-[80px]"
                      onClick={() => handleDelete(curso.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes fadein { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: none; } 
        }
      `}</style>
    </div>
  );
}
