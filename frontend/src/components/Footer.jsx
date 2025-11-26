export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo y descripción */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <img
              src="/pata2.png"
              alt="Logotipo de PATA"
              className="w-30 h-30 object-contain"
            />
           
          </div>
          <p className="text-sm text-gray-100 leading-relaxed">
            Conectamos mascotas sin hogar con nuevas familias llenas de amor.  
            Únete a nuestra comunidad y ayúdanos a darles una segunda oportunidad 🐾
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Enlaces</h3>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#" className="hover:text-white">Inicio</a></li>
            <li><a href="#" className="hover:text-white">Adopciones</a></li>
            <li><a href="#" className="hover:text-white">Extraviados</a></li>
            <li><a href="#" className="hover:text-white">Refugios</a></li>
            <li><a href="#" className="hover:text-white">Contacto</a></li>
          </ul>
        </div>

        {/* Redes */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Síguenos</h3>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-green-300 text-2xl">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-green-300 text-2xl">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-green-300 text-2xl">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" className="hover:text-green-300 text-2xl">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="bg-green-900 text-center text-sm py-4 text-gray-100 border-t border-green-700">
        © {new Date().getFullYear()} <span className="font-semibold">PATA</span> — Todos los derechos reservados 🐶🐱
      </div>
    </footer>
  );
}
