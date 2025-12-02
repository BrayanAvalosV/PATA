// frontend/src/components/SobreNosotros.jsx
import { Link } from "react-router-dom";
import UniqueDivider from "./UniqueDivider";

const teamPhotos = {
  hero:
    "https://images.pexels.com/photos/7474088/pexels-photo-7474088.jpeg?auto=compress&cs=tinysrgb&w=1600",
  shelter:
    "https://images.pexels.com/photos/11683889/pexels-photo-11683889.jpeg?auto=compress&cs=tinysrgb&w=1600",
  abuelitas:
    "https://images.pexels.com/photos/11430124/pexels-photo-11430124.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

export default function SobreNosotros() {
  return (
    <main className="bg-gray-50 pt-24 pb-16">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 lg:px-0 grid lg:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-800 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
            Sobre PATA
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Conectamos historias de{" "}
            <span className="text-green-700">mascotas y familias</span> en todo
            Chile.
          </h1>

          <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
            PATA nace en 2025 como un proyecto universitario con impacto real:
            una plataforma que facilita la adopción responsable y la difusión de
            mascotas extraviadas, pensada para fundaciones, rescatistas y
            familias que aman a los animales.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                1
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Enfoque en la experiencia
                </p>
                <p className="text-gray-600">
                  Buscamos que publicar, adoptar o reportar una mascota perdida
                  sea simple, rápido y claro.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                2
              </span>
              <div>
                <p className="font-semibold text-gray-900">Impacto local</p>
                <p className="text-gray-600">
                  Diseñado pensando en la realidad chilena: regiones, comunas y
                  trabajo cercano con rescatistas.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              href="#equipo"
              className="inline-flex items-center px-4 py-2 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition"
            >
              Conoce al equipo
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center px-4 py-2 rounded-full border border-green-200 text-green-800 font-semibold hover:bg-green-50 transition"
            >
              Cómo funciona PATA
            </a>
          </div>
        </div>

        {/* Columna con imágenes */}
        <div className="relative">
          {/* Tarjeta principal */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-green-100 bg-white">
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={teamPhotos.hero}
                alt="Voluntaria jugando con un perro en un ambiente de adopción"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                Comunidad PATA
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Personas, organizaciones y familias conectadas por el mismo
                propósito: darles una segunda oportunidad a las mascotas.
              </p>
            </div>
          </div>

          {/* Tarjeta secundaria abajo a la izquierda */}
          <div className="hidden sm:block absolute -bottom-6 -left-4 w-40 rounded-2xl overflow-hidden shadow-lg border border-amber-100 bg-white">
            <div className="h-24 w-full overflow-hidden">
              <img
                src={teamPhotos.shelter}
                alt="Refugio con varias mascotas siendo alimentadas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2.5">
              <p className="text-[11px] font-semibold text-gray-900">
                Trabajo con refugios
              </p>
              <p className="text-[10px] text-gray-600">
                Construimos una herramienta pensada también para fundaciones y
                rescatistas.
              </p>
            </div>
          </div>

          {/* Tarjeta secundaria arriba a la derecha */}
          <div className="hidden sm:block absolute -top-6 right-0 w-40 rounded-2xl overflow-hidden shadow-lg border border-blue-100 bg-white">
            <div className="h-24 w-full overflow-hidden">
              <img
                src={teamPhotos.abuelitas}
                alt="Personas mayores con sus perros en un hogar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2.5">
              <p className="text-[11px] font-semibold text-gray-900">
                Historias que inspiran
              </p>
              <p className="text-[10px] text-gray-600">
                Creemos en adopciones que cambian no solo la vida de las
                mascotas, sino también de las personas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider luminoso */}
      <div className="mt-12">
        <UniqueDivider variant="gold" thickness={2} />
      </div>

      {/* BLOQUE DE ESTADÍSTICAS */}
      <section className="max-w-6xl mx-auto px-4 lg:px-0 mt-10">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
              Proyecto universitario
            </p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">2025</p>
            <p className="mt-1 text-xs text-gray-600">
              Nacido en la Universidad de La Serena, pero diseñado para escalar
              a todo Chile.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
              Enfoque en usabilidad
            </p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              UX First
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Interfaces simples, lenguaje cercano y procesos guiados para cada
              tipo de usuario.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
              Visión a futuro
            </p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              + funcionalidades
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Integración con fundaciones, métricas de impacto y campañas
              educativas sobre cuidado responsable.
            </p>
          </div>
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section className="max-w-6xl mx-auto px-4 lg:px-0 mt-14 grid lg:grid-cols-[1.35fr,1fr] gap-10 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Cómo nació PATA
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-5">
            PATA comenzó como la respuesta a una pregunta muy simple:{" "}
            <span className="font-semibold">
              ¿por qué todavía es tan difícil adoptar o reportar una mascota
              perdida de forma clara y confiable?
            </span>{" "}
            A partir de ahí, el equipo empezó a conversar con rescatistas,
            hogares temporales y familias que ya habían adoptado.
          </p>

          <div className="space-y-4 text-sm">
            {/* TODO parte en 2025 */}
            <div className="flex gap-3">
              <div className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                2025
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Primeros bocetos y entrevistas
                </p>
                <p className="text-gray-600">
                  Durante 2025 identificamos dolores concretos: procesos lentos,
                  información desordenada y poca visibilidad de mascotas en
                  regiones.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                2025+
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Construcción de la plataforma
                </p>
                <p className="text-gray-600">
                  Definimos un MVP con dos focos: publicar mascotas en adopción
                  y reportar extraviados con un mapa claro y filtros útiles.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Futuro
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Comunidad y alianzas
                </p>
                <p className="text-gray-600">
                  Nuestro siguiente paso es trabajar con refugios y municipios
                  para que PATA sea una herramienta oficial y confiable para
                  toda la comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen lateral grande */}
        <div className="bg-white rounded-3xl shadow-md border border-green-50 overflow-hidden">
          <div className="h-56 w-full overflow-hidden">
            <img
              src={teamPhotos.shelter}
              alt="Voluntaria alimentando a varios perros en un refugio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
              Inspirado en refugios reales
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Observamos cómo funcionan los refugios y rescates para adaptar
              PATA a su día a día: muchas mascotas, poco tiempo y recursos
              limitados.
            </p>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" className="max-w-6xl mx-auto px-4 lg:px-0 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          El equipo detrás de PATA
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-6 max-w-3xl">
          PATA es desarrollado por estudiantes de Ingeniería en Computación,
          combinando{" "}
          <span className="font-semibold">
            desarrollo web, experiencia de usuario y responsabilidad social
          </span>
          . Nos organizamos como si fuera un producto real en producción.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          <article className="bg-white rounded-2xl shadow-sm border border-green-50 p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">
              Producto & UX
            </p>
            <p className="text-sm text-gray-700">
              Definición del flujo de adopción, publicaciones claras, textos
              cercanos y énfasis en accesibilidad y dispositivos móviles.
            </p>
          </article>

          <article className="bg-white rounded-2xl shadow-sm border border-green-50 p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">
              Desarrollo & Arquitectura
            </p>
            <p className="text-sm text-gray-700">
              Stack MERN, API organizada, componentes reutilizables en React y
              foco en seguridad básica para cuentas y publicaciones.
            </p>
          </article>

          <article className="bg-white rounded-2xl shadow-sm border border-green-50 p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">
              Vinculación con el medio
            </p>
            <p className="text-sm text-gray-700">
              Contacto con fundaciones, rescatistas independientes y hogares
              temporales para que la plataforma resuelva problemas reales.
            </p>
          </article>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section
        id="como-funciona"
        className="max-w-6xl mx-auto px-4 lg:px-0 mt-16"
      >
        <div className="bg-white rounded-3xl shadow-md border border-green-50 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Cómo queremos que se viva PATA
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-5 max-w-3xl">
            Más que un “sitio de avisos”, PATA está pensada como una{" "}
            <span className="font-semibold">
              experiencia acompañada y segura
            </span>{" "}
            desde que ves una foto hasta que una mascota llega a su nuevo
            hogar.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="border border-green-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
                1. Descubre
              </p>
              <p className="mt-1 text-gray-700">
                Filtra por tipo de mascota, región y otras características
                relevantes. Las tarjetas están pensadas para entender lo
                esencial en segundos.
              </p>
            </div>
            <div className="border border-green-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
                2. Conecta
              </p>
              <p className="mt-1 text-gray-700">
                Cada publicación busca facilitar el contacto respetuoso entre
                quien publica y quien quiere ayudar o adoptar.
              </p>
            </div>
            <div className="border border-green-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-widest">
                3. Acompaña
              </p>
              <p className="mt-1 text-gray-700">
                Futuras versiones incluirán seguimiento de casos, historias de
                reencuentro y educación sobre tenencia responsable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA VERDE FINAL (recuadro que te gustaba) */}
      <section className="max-w-6xl mx-auto px-4 lg:px-0 mt-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-10 md:px-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              ¿Te gustaría ser parte de la historia de PATA?
            </h2>
            <p className="text-sm md:text-base text-emerald-50 mb-5">
              Ya sea adoptando, difundiendo, publicando mascotas extraviadas o
              proponiendo mejoras, tu participación hace que esta plataforma
              tenga sentido.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/adopta"
                className="inline-flex items-center justify-center rounded-full bg-white text-green-800 px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-emerald-50"
              >
                Ver mascotas en adopción
              </Link>
              <Link
                to="/extraviados"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200/70 text-emerald-50 px-4 py-2 text-xs md:text-sm font-medium hover:bg-emerald-600/40"
              >
                Ver mapa de extraviados
              </Link>
            </div>
          </div>
          <span className="pointer-events-none absolute -right-6 bottom-0 text-[110px] text-emerald-500/40">
            <i className="fa-solid fa-paw" />
          </span>
        </div>
      </section>
    </main>
  );
}