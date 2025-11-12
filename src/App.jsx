import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Adopciones from "./components/Adopciones";
import Categorias from "./components/Categorias";
import Extraviados from "./components/Extraviados";
import PublicarMascota from "./components/PublicarMascota";
import Footer from "./components/Footer";

// 🔹 Página principal (Inicio)
function Home({ mascotasAdopcion, mascotasExtraviadas }) {
  // 🔸 Tomamos solo las 3 más recientes
  const recientesAdopcion = [...mascotasAdopcion].slice(-3).reverse();
  const recientesExtraviadas = [...mascotasExtraviadas].slice(-3).reverse();

  return (
    <>
      <Hero />
      <Categorias />
      <Adopciones mascotas={recientesAdopcion} />
      <Extraviados mascotas={recientesExtraviadas} />
      <Footer />
    </>
  );
}

export default function App() {
  const [mascotasAdopcion, setMascotasAdopcion] = useState([]);
  const [mascotasExtraviadas, setMascotasExtraviadas] = useState([]);

  const handlePublicarMascota = (nuevaMascota) => {
    if (nuevaMascota.tipo === "adopcion") {
      const actualizadas = [...mascotasAdopcion, nuevaMascota];
      setMascotasAdopcion(actualizadas);
      localStorage.setItem("mascotasAdopcion", JSON.stringify(actualizadas));
    } else if (nuevaMascota.tipo === "extraviado") {
      const actualizadas = [...mascotasExtraviadas, nuevaMascota];
      setMascotasExtraviadas(actualizadas);
      localStorage.setItem("mascotasExtraviadas", JSON.stringify(actualizadas));
    }
  };

  useEffect(() => {
    const guardadasAdopcion = localStorage.getItem("mascotasAdopcion");
    const guardadasExtraviadas = localStorage.getItem("mascotasExtraviadas");

    if (guardadasAdopcion)
      setMascotasAdopcion(JSON.parse(guardadasAdopcion));
    if (guardadasExtraviadas)
      setMascotasExtraviadas(JSON.parse(guardadasExtraviadas));
  }, []);

  return (
    <BrowserRouter>
      <div className="font-sans bg-gray-50 min-h-screen">
        <Navbar />

        <Routes>
          {/* 🏠 Inicio (solo 3 más recientes) */}
          <Route
            path="/"
            element={
              <Home
                mascotasAdopcion={mascotasAdopcion}
                mascotasExtraviadas={mascotasExtraviadas}
              />
            }
          />

          {/* 🐶 Adopta (todas) */}
          <Route
            path="/adopta"
            element={
              <>
                <Adopciones mascotas={mascotasAdopcion} />
                <Footer />
              </>
            }
          />

          {/* 🔎 Extraviados (todas) */}
          <Route
            path="/extraviados"
            element={
              <>
                <Extraviados mascotas={mascotasExtraviadas} />
                <Footer />
              </>
            }
          />

          {/* ✏️ Publicar */}
          <Route
            path="/publicar"
            element={
              <>
                <PublicarMascota onPublicar={handlePublicarMascota} />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
