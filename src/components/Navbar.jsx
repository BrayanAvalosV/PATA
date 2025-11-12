import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/pata2.png"
            alt="Logotipo de PATA"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Enlaces */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-green-700">
            Inicio
          </Link>
          <Link to="/adopta" className="hover:text-green-700">
            Adopta
          </Link>
          <Link to="/extraviados" className="hover:text-green-700">
            Extraviados
          </Link>
          <Link to="/publicar" className="hover:text-green-700">
            Publicar
          </Link>
          <Link to="/refugios" className="hover:text-green-700">
            Refugios
          </Link>
          <Link to="/nosotros" className="hover:text-green-700">
            Nosotros
          </Link>
        </div>

        {/* Botones */}
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-green-800 hover:text-green-600">
            Iniciar sesión
          </button>
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Regístrate
          </button>
        </div>
      </div>
    </nav>
  );
}
