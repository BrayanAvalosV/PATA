import { Link } from "react-router-dom";

export default function Categorias() {
  const categorias = [
    { nombre: "Perros", icono: "fa-dog", tipo: "perro" },
    { nombre: "Gatos", icono: "fa-cat", tipo: "gato" },
    { nombre: "Otras mascotas", icono: "fa-paw", tipo: "otro" },
  ];

  return (
    <section className="relative bg-transparent py-10 -mt-32 z-30 flex justify-center items-center">
      <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto px-4">
        {categorias.map((c) => (
          <Link
            key={c.nombre}
            to={`/adopta?tipo=${c.tipo}`}
            className="bg-white w-64 h-48 rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <i
              className={`fa-solid ${c.icono} text-green-600 text-6xl mb-4`}
            ></i>
            <h3 className="text-gray-800 text-xl font-semibold">
              {c.nombre}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}