import Hero from "./Hero";
import Categorias from "./Categorias";
import ResumenSecciones from "./ResumenSecciones";
import Footer from "./Footer";
import UniqueDivider from "./UniqueDivider";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />

      <section className="mt-10">
        <Categorias />
      </section>

      {/* TEST ROJO */}
      <section className="py-10">
        <div className="h-10 bg-red-500 text-white flex items-center justify-center">
          AQUI VA EL DIVIDER
        </div>
      </section>

      <ResumenSecciones />

      <Footer />
    </main>
  );
}
