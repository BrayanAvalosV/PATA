import Hero from "./Hero";
import Categorias from "./Categorias";
import Adopciones from "./Adopciones";
import Extraviados from "./Extraviados";
import Footer from "./Footer";

export default function Home() {
  return (
    <main className="bg-white">
      {/* Sección principal con video y frase */}
      <Hero />

      {/* Categorías (Perros, Gatos, Otros) */}
      <section className="mt-10">
        <Categorias />
      </section>

      {/* Mascotas en adopción y extraviadas (aleatorias en el futuro) */}
      <section className="py-10 bg-gray-50">
        <h2 className="text-center text-4xl font-bold mb-6 text-green-700">
          Mascotas Destacadas 🐾
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {/* Muestras ambas secciones por ahora */}
          <Adopciones />
          <Extraviados />
        </div>
      </section>

      <Footer />
    </main>
  );
}
