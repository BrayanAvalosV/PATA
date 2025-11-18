import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Adopciones from "./components/Adopciones";
import Categorias from "./components/Categorias";
import Extraviados from "./components/Extraviados";
import PublicarMascota from "./components/PublicarMascota";
import Footer from "./components/Footer";
import DetalleMascota from "./components/DetalleMascota";
import Login from "./components/Login";
import Registro from "./components/Registro";
import ProtectedRoute from "./components/ProtectedRoute";
import StatsFloating from "./components/StatsFloating";

// 🔹 nuevos imports
import MapaGlobalExtraviados from "./components/MapaGlobalExtraviados";
import AdminSolicitudes from "./components/AdminSolicitudes";
import AdminRoute from "./components/AdminRoute";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ---------- helpers ----------
const asArray = (data) => (Array.isArray(data) ? data : data?.items || []);
const fetchList = async (tipo, limit) => {
  const url = `${API}/api/mascotas?tipo=${encodeURIComponent(
    tipo
  )}${limit ? `&limit=${limit}` : ""}&_=${Date.now()}`;
  try {
    const r = await fetch(url, { cache: "no-store" }); // sin headers extra (evita CORS preflight)
    if (!r.ok) return [];
    return asArray(await r.json());
  } catch {
    return [];
  }
};

// ---------- portada ----------
function Home() {
  const [recientesAdop, setRecientesAdop] = useState([]);
  const [recientesExt, setRecientesExt] = useState([]);

  useEffect(() => {
    (async () => {
      const [a, e] = await Promise.all([
        fetchList("adopcion", 3),
        fetchList("extraviado", 3),
      ]);
      setRecientesAdop(a);
      setRecientesExt(e);
    })();
  }, []);

  return (
    <>
      <StatsFloating />
      <Hero />
      <Categorias />
      <Adopciones mascotas={recientesAdop} />
      <Extraviados mascotas={recientesExt} />
      <Footer />
    </>
  );
}

// ---------- páginas de lista completas ----------
function AdoptaPage() {
  const [items, setItems] = useState(null); // null = cargando

  useEffect(() => {
    (async () => setItems(await fetchList("adopcion")))();
  }, []);

  return (
    <>
      {items === null ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
              Mascotas en Adopción 🐶🐱
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-2xl p-4 animate-pulse h-80"
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <Adopciones mascotas={items} />
      )}
      <Footer />
    </>
  );
}

function ExtraviadosPage() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => setItems(await fetchList("extraviado")))();
  }, []);

  return (
    <>
      {items === null ? (
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-amber-600 mb-10">
              Mascotas Extraviadas 🔍
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-2xl p-4 animate-pulse h-80"
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <Extraviados mascotas={items} />
      )}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopta" element={<AdoptaPage />} />
        <Route path="/extraviados" element={<ExtraviadosPage />} />

        {/* mapa global de extraviados */}
        <Route
          path="/mapa-extraviados"
          element={
            <>
              <MapaGlobalExtraviados />
              <Footer />
            </>
          }
        />

        {/* publicar (ya protegida) */}
        <Route
          path="/publicar"
          element={
            <ProtectedRoute>
              <>
                <PublicarMascota />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* detalle */}
        <Route
          path="/post/:id"
          element={
            <>
              <DetalleMascota />
              <Footer />
            </>
          }
        />

        {/* auth */}
        <Route
          path="/login"
          element={
            <>
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/registro"
          element={
            <>
              <Registro />
              <Footer />
            </>
          }
        />

        {/* panel admin */}
        <Route
          path="/admin/solicitudes"
          element={
            <AdminRoute>
              <>
                <AdminSolicitudes />
                <Footer />
              </>
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}
