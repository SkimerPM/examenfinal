// =================== FACULTADESLIST ===================
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function FacultadesList() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getFacultades();
  }, []);

  async function getFacultades() {
    setLoading(true);
    try {
      const res = await api.get("facultades/");
      setFacultades(res.data);
      setError("");
    } catch {
      setError("Error al obtener facultades");
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      if (imagen) formData.append("imagen", imagen);
      if (editId) {
        await api.put(`facultades/${editId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("facultades/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setNombre("");
      setDescripcion("");
      setImagen(null);
      setEditId(null);
      await getFacultades();
    } catch (err) {
      setError("Error al guardar facultad");
    }
  }

  function handleEdit(fac) {
    setNombre(fac.nombre);
    setDescripcion(fac.descripcion);
    setImagen(null);
    setEditId(fac.id);
  }

  async function handleDelete(id) {
    if (window.confirm("¿Seguro que quieres eliminar esta facultad?")) {
      try {
        await api.delete(`facultades/${id}/`);
        setFacultades(facultades.filter((f) => f.id !== id));
      } catch {
        setError("Error al eliminar facultad");
      }
    }
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
      <div
        className="bg-white/30 backdrop-blur-xl shadow-xl rounded-3xl border border-cyan-100 p-8 sm:p-10 lg:p-14 transition-all"
        style={{
          boxShadow:
            "0 6px 32px 0 rgba(0,176,255,0.16), 0 2px 8px 0 rgba(0,0,0,0.07)",
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-700 mb-8 tracking-tight font-mono text-center">
          Facultades
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center"
        >
          <input
            type="text"
            required
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="px-4 py-3 w-full sm:w-52 bg-white/40 backdrop-blur-md border border-cyan-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
          />
          <input
            type="text"
            required
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="px-4 py-3 w-full sm:w-64 bg-white/40 backdrop-blur-md border border-cyan-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="px-4 py-3 w-full sm:w-48 border border-cyan-200 rounded-lg cursor-pointer bg-white/60 text-cyan-700"
          />
          <div className="flex gap-4">
            <button
              className="px-7 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 text-white shadow hover:scale-105 hover:shadow-lg focus:outline-none transition-all duration-150"
              type="submit"
            >
              {editId ? "Actualizar" : "Crear"}
            </button>
            {editId && (
              <button
                type="button"
                className="px-5 py-3 rounded-lg bg-cyan-100 text-cyan-700 hover:bg-cyan-200 focus:outline-none"
                onClick={() => {
                  setNombre("");
                  setDescripcion("");
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
          {facultades.map((fac, idx) => (
            <li
              key={fac.id}
              className="py-6 flex flex-col sm:flex-row items-center justify-between group animate-fadein gap-6 sm:gap-0"
              style={{
                animationDelay: `${idx * 70}ms`,
                animationName: "fadein",
                animationDuration: "0.4s",
                animationFillMode: "both",
                animationTimingFunction: "ease-out",
              }}
            >
              <span className="flex items-center gap-5 w-full">
                {fac.imagen && (
                  <img
                    src={
                      fac.imagen.startsWith("http")
                        ? fac.imagen
                        : `http://localhost:8000${fac.imagen}`
                    }
                    alt={fac.nombre}
                    className="h-16 w-16 object-cover rounded-xl border border-cyan-200 shadow"
                  />
                )}
                <span className="font-semibold text-gray-900 text-lg sm:text-xl font-sans">
                  {fac.nombre}
                </span>
                <span className="text-neutral-500 sm:ml-2">{fac.descripcion}</span>
              </span>
              <span className="flex gap-4 mt-4 sm:mt-0">
                <button
                  className="bg-cyan-600 text-white px-5 py-2 rounded-lg shadow border-2 border-cyan-100 hover:bg-cyan-500 hover:scale-105 focus:outline-none focus:ring focus:ring-cyan-300 transition"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit(fac)}
                >
                  Editar
                </button>
                <button
                  className="bg-white/70 text-cyan-600 px-5 py-2 rounded-lg border border-cyan-300 hover:bg-cyan-50 hover:scale-105 focus:outline-none focus:ring focus:ring-cyan-200 transition"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(fac.id)}
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

