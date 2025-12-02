export default function Categorias() {
  const categorias = [
    { nombre: "Perros", icono: "fa-dog" },
    { nombre: "Gatos", icono: "fa-cat" },
    { nombre: "Otras mascotas", icono: "fa-paw" },
  ];

  return (
    <section className="relative bg-transparent py-10 -mt-32 z-30 flex justify-center items-center">
      <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto px-4">
        {categorias.map((c) => (
          <div
            key={c.nombre}
            className="bg-white w-64 h-48 rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <i className={`fa-solid ${c.icono} text-green-600 text-6xl mb-4`}></i>
            <h3 className="text-gray-800 text-xl font-semibold">{c.nombre}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
