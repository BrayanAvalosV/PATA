// frontend/src/components/FaqAdopcion.jsx
import { useState } from "react";

const PREGUNTAS = [
  {
    pregunta: "¿Dónde puedo encontrar perros en adopción en Chile?",
    respuesta:
      "Puedes encontrar perros en adopción a través de fundaciones, refugios, municipalidades y plataformas en línea como PATA. Muchas organizaciones publican sus casos en redes sociales y sitios web oficiales.",
  },
  {
    pregunta: "¿Qué requisitos necesito para adoptar una mascota?",
    respuesta:
      "Por lo general se solicita ser mayor de edad, presentar cédula de identidad, completar un formulario, realizar una entrevista y firmar un compromiso de adopción responsable. Algunas fundaciones también hacen una visita al hogar.",
  },
  {
    pregunta: "¿Puedo adoptar gatos u otras mascotas en regiones?",
    respuesta:
      "Sí. Existen organizaciones y rescatistas en casi todas las regiones. En plataformas como PATA puedes filtrar por región y tipo de mascota para encontrar casos cercanos a tu zona.",
  },
  {
    pregunta: "¿Cuánto cuesta mantener un perro o gato adoptado?",
    respuesta:
      "Depende del tamaño y necesidades de la mascota, pero debes considerar alimento mensual, controles veterinarios, vacunas, desparasitación y posibles emergencias. Es importante tener un presupuesto básico reservado.",
  },
  {
    pregunta: "¿Cómo funciona el proceso de adopción responsable?",
    respuesta:
      "Normalmente se llena un formulario, luego hay una entrevista o llamada, se coordina la entrega y se firma un documento de adopción. El objetivo es asegurar que la mascota llegue a un hogar estable y comprometido.",
  },
  {
    pregunta: "¿Cómo elegir la mascota adecuada para mi familia?",
    respuesta:
      "Considera el tamaño de tu hogar, el tiempo disponible, si hay niños o adultos mayores, y el nivel de energía de la mascota. Los rescatistas suelen ayudarte a encontrar un compañero que se adapte a tu estilo de vida.",
  },
  {
    pregunta:
      "¿Qué beneficios tiene adoptar mascotas adultas en lugar de cachorros?",
    respuesta:
      "Las mascotas adultas ya tienen su personalidad definida, suelen ser más tranquilas, en muchos casos ya están educadas y agradecen muchísimo la oportunidad de tener una segunda familia.",
  },
];

export default function FaqAdopcion() {
  const [abierta, setAbierta] = useState(null);

  const toggle = (index) => {
    setAbierta((prev) => (prev === index ? null : index));
  };

  return (
    // 👇 fondo igual al resto del sitio
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-2">
          Preguntas frecuentes sobre adopción
        </h2>
        <p className="text-sm md:text-base text-slate-500 text-center mb-8">
          Resolvemos algunas dudas comunes antes de dar el paso a adoptar.
        </p>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40">
          {PREGUNTAS.map((item, index) => {
            const activa = abierta === index;
            return (
              <div key={item.pregunta} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition"
                >
                  <span className="text-sm md:text-base font-medium text-slate-900">
                    {item.pregunta}
                  </span>
                  <span className="ml-4 text-slate-400">
                    <i
                      className={`fa-solid ${
                        activa ? "fa-chevron-up" : "fa-chevron-down"
                      } text-xs`}
                    />
                  </span>
                </button>

                {activa && (
                  <div className="px-5 pb-4 text-sm text-slate-600 bg-slate-50">
                    {item.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}