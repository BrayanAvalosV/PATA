import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
// frontend/src/App.jsx
import { useEffect, useState, useMemo } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

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

import UniqueDivider from "./components/UniqueDivider";
import TipoMascotaModal from "./components/TipoMascotaModal";
import FaqAdopcion from "./components/FaqAdopcion";
import SobreNosotros from "./components/SobreNosotros";
import ListaFundaciones from "./components/ListaFundaciones";
import PerfilFundacion from "./components/PerfilFundacion";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ---------- helpers ----------
const asArray = (data) => (Array.isArray(data) ? data : data?.items || []);

const fetchList = async (tipo, limit) => {
  const url = `${API}/api/mascotas?tipo=${encodeURIComponent(
    tipo
  )}${limit ? `&limit=${limit}` : ""}&_=${Date.now()}`;

  try {
    const r = await fetch(url, { cache: "no-store" }); // sin headers extra (evita CORS preflight)
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return [];
    return asArray(await r.json());
  } catch {
    return [];
  }
};

function Home() {
  const [allAdop, setAllAdop] = useState([]);
  const [allExt, setAllExt] = useState([]);
  const [recientesAdop, setRecientesAdop] = useState(null);
  const [recientesExt, setRecientesExt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startAdop, setStartAdop] = useState(0);
  const [startExt, setStartExt] = useState(0);

  // helper para tomar una ventana circular de N elementos
  const pickWindow = (arr, start, size = 3) => {
    if (!arr || arr.length <= size) return arr;
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(arr[(start + i) % arr.length]);
    }
    return result;
  };

  // 1) Cargar todas las mascotas
  useEffect(() => {
    (async () => {
      const [a, e] = await Promise.all([
        fetchList("adopcion"),
        fetchList("extraviado"),
      ]);

      setAllAdop(a);
      setAllExt(e);

      setRecientesAdop(pickWindow(a, 0));
      setRecientesExt(pickWindow(e, 0));
      setLoading(false);
    })();
  }, []);

  // 2) Rotar las ventanas cada cierto tiempo (20 segundos)
  useEffect(() => {
    if (!allAdop.length && !allExt.length) return;

    const interval = setInterval(() => {
      setStartAdop((prev) => {
        if (!allAdop.length) return prev;
        const next = (prev + 3) % allAdop.length;
        setRecientesAdop(pickWindow(allAdop, next));
        return next;
      });

      setStartExt((prev) => {
        if (!allExt.length) return prev;
        const next = (prev + 3) % allExt.length;
        setRecientesExt(pickWindow(allExt, next));
        return next;
      });
    }, 20000); // 20 segundos

    return () => clearInterval(interval);
  }, [allAdop, allExt]);

  return (
    <>
      <StatsFloating />
      <Hero />
      <Categorias />

      {loading ? (
        <section className="py-10 text-center text-gray-500">
          Cargando mascotas destacadas...
        </section>
      ) : (
        <>
          {/* 🔹 Adopción: 3 (rotando) + botón */}
          <section>
            <Adopciones mascotas={recientesAdop} />
            <div className="max-w-7xl mx-auto px-6 mt-4 mb-12 flex justify-end">
              <Link
                to="/adopta"
                className="inline-flex items-center rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Ver todas las adopciones →
              </Link>
            </div>
          </section>

          {/* Divider entre Adopción y Extraviados */}
          <section className="py-4">
            <div className="max-w-4xl mx-auto">
              <UniqueDivider variant="green" thickness={2} />
            </div>
          </section>

          {/* 🔹 Extraviados: 3 (rotando) + botón */}
          <section className="mt-4">
            <Extraviados mascotas={recientesExt} />
            <div className="max-w-7xl mx-auto px-6 mt-4 mb-12 flex justify-end">
              <Link
                to="/extraviados"
                className="inline-flex items-center rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
              >
                Ver todos los extraviados →
              </Link>
            </div>
          </section>

          {/* Divider entre Extraviados y FAQ */}
          <section className="py-4">
            <div className="max-w-4xl mx-auto">
              <UniqueDivider variant="green" thickness={2} />
            </div>
          </section>
        </>
      )}

      {/* Preguntas frecuentes al final del inicio */}
      <FaqAdopcion />

      <Footer />
    </>
  );
}

// ---------- página Adopta con modal + filtro por query ----------
function AdoptaPage() {
  const location = useLocation();
  const [items, setItems] = useState(null); // todas las mascotas de adopción
  const [tipoFiltro, setTipoFiltro] = useState(null); // "perro" | "gato" | "otro" | null
  const [showModal, setShowModal] = useState(true);

  // Lee ?tipo=perro|gato|otro de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipoParam = params.get("tipo");

    if (tipoParam === "perro" || tipoParam === "gato" || tipoParam === "otro") {
      setTipoFiltro(tipoParam);
      setShowModal(false); // venido desde las tarjetas → sin modal
    } else {
      setShowModal(true); // acceso normal → con modal
    }
  }, [location.search]);

  // Cargar todas las adopciones
  useEffect(() => {
    (async () => {
      const data = await fetchList("adopcion");
      setItems(data);
    })();
  }, []);

  // Aplica el filtro de tipo (solo front)
  const filteredItems = useMemo(() => {
    if (!items) return null;
    if (!tipoFiltro) return items;

    const t = tipoFiltro.toLowerCase();

    return items.filter((m) => {
      const tipo = (m.tipoMascota || "").toLowerCase();
      if (t === "otro") {
        // otras mascotas: todo lo que no sea perro ni gato
        return tipo !== "perro" && tipo !== "gato";
      }
      return tipo === t;
    });
  }, [items, tipoFiltro]);

  return (
    <>
      {/* Modal de selección inicial (solo cuando no venimos con ?tipo=) */}
      {items && showModal && (
        <TipoMascotaModal
          open={showModal}
          onSelect={(tipo) => {
            setTipoFiltro(tipo);
            setShowModal(false);
          }}
          onClose={() => {
            setTipoFiltro(null); // "Ver todas sin filtro"
            setShowModal(false);
          }}
        />
      )}

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
        <Adopciones mascotas={filteredItems || []} />
      )}

      <Footer />
    </>
  );
}

// ---------- página Extraviados completa ----------
function ExtraviadosPage() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      setItems(await fetchList("extraviado"));
    })();
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

// ---------- página Sobre Nosotros ----------
function SobreNosotrosPage() {
  return (
    <>
      <SobreNosotros />
      <Footer />
    </>
  );
}

// ---------- app ----------
export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopta" element={<AdoptaPage />} />
        <Route path="/extraviados" element={<ExtraviadosPage />} />
        <Route path="/nosotros" element={<SobreNosotrosPage />} />

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

        {/* publicar (protegida) */}
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
        <Route
          path="/fundaciones"
          element={
            <>
              <ListaFundaciones />
              <Footer />
            </>
          }
        />

        <Route
          path="/fundacion/:id"
          element={
            <>
              <PerfilFundacion />
              <Footer />
            </>
          }
        />  
      </Routes>
    </div>
  );
}