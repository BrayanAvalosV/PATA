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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-extrabold text-green-700">
              PATA
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navItem("/", "Inicio")}
            {navItem("/adopta", "Adopta")}
            {navItem("/extraviados", "Extraviados")}
            {user && navItem("/publicar", "Publicar")}

            <div className="w-px h-6 bg-green-200 mx-2" />

            {!user ? (
              <>
                {navItem("/login", "Entrar")}
                {navItem("/registro", "Crear cuenta")}
              </>
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

          {/* Mobile button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-green-800 hover:bg-green-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open Menu"
          >
            <span>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
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
      )}
    </nav>
  );
}
