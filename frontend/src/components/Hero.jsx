import { Link } from "react-router-dom";

export default function HeroVideo() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
      >
        <source src="/perro-fondo.mp4" type="video/mp4" />
      </video>

      {/* Contenido centrado */}
      <div className="relative z-10 px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Adopta un <span className="text-green-400">perro</span> o{" "}
          <span className="text-green-400">gato</span> en Chile
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-100">
          Explora cientos de mascotas en adopción y encuentra tu compañero ideal
        </p>

        <div className="flex justify-center space-x-6">
          <Link
            to="/fundaciones"
            className="border-2 border-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            Refugios y organizaciones
          </Link>
        </div>
      </div>
    </section>
  );
}
