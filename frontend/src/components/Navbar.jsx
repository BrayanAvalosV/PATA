// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser, clearSession } from "../services/session";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = getUser();
  const { pathname } = useLocation();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        pathname === to ? "text-white bg-green-700" : "text-green-800 hover:bg-green-100"
      }`}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-green-100"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MOBILE: logo + hamburguesa */}
        <div className="h-10 flex items-center md:hidden justify-between">
          <Link to="/" className="inline-flex items-center" onClick={() => setOpen(false)}>
            {/* Logo más grande sin alterar la altura de la navbar */}
            <img
              src={`${import.meta.env.BASE_URL}pata2.png`} // frontend/public/pata2.png
              alt="PATA"
              className="h-60 w-auto select-none transform scale-150 origin-left"
              draggable="false"
            />
          </Link>
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-green-800 hover:bg-green-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span>{open ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* DESKTOP: grid de 3 columnas → logo izq / menú centro / usuario der */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center h-16">
          {/* Col 1: Logo izquierda (agrandado con scale, no cambia el layout) */}
          <div className="flex items-center justify-start">
            <Link to="/" className="inline-flex items-center" onClick={() => setOpen(false)}>
              <img
                src={`${import.meta.env.BASE_URL}pata2.png`}
                alt="PATA"
                className="h-10 w-auto select-none transform scale-125 origin-left"
                draggable="false"
              />
            </Link>
          </div>

          {/* Col 2: Menú centrado */}
          <div className="flex items-center justify-center gap-2">
            {navItem("/", "Inicio")}
            {navItem("/adopta", "Adopta")}
            {navItem("/extraviados", "Extraviados")}
            {user && navItem("/publicar", "Publicar")}
          </div>

          {/* Col 3: Usuario a la derecha */}
          <div className="flex items-center justify-end gap-3">
            <div className="w-px h-6 bg-green-200 hidden lg:block" />
            {!user ? (
              <div className="flex items-center gap-2">
                {navItem("/login", "Entrar")}
                {navItem("/registro", "Crear cuenta")}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-900">
                  Hola, <b>{user.nombre?.split(" ")[0] || "Usuario"}</b>
                </span>
                <button
                  onClick={() => {
                    clearSession();
                    window.location.reload();
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div
        id="mobile-menu"
        className={`md:hidden border-t bg-white transition-[max-height,opacity] duration-200 overflow-hidden ${
          open ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-2">
          {navItem("/", "Inicio")}
          {navItem("/adopta", "Adopta")}
          {navItem("/extraviados", "Extraviados")}
          {user && navItem("/publicar", "Publicar")}
          <div className="h-px bg-green-200 my-1" />
          {!user ? (
            <>
              {navItem("/login", "Entrar")}
              {navItem("/registro", "Crear cuenta")}
            </>
          ) : (
            <button
              onClick={() => {
                clearSession();
                window.location.reload();
              }}
              className="px-3 py-2 rounded-md text-left text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
