"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CerrarSesionButton from "./CerrarSesionBoton";
import { useEffect, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Columna izquierda: Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo AlquilApp Car"
              width={140}
              height={140}
              priority
            />
          </Link>
        </div>

        {/* Columna central: Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-10 text-xl font-semibold">
            <Link
              href="/sucursales"
              className={`hover:text-amber-900 transition-colors ${
                pathname === "/sucursales"
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline transition-colors"

              }`}
            >
              Sucursales
            </Link>
            <Link
              href="/flota"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/flota")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline transition-colors"
              }`}
            >
              Flota
            </Link>
            <Link
              href="/mis-reservas"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/mis-reservas")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline transition-colors"
              }`}
            >
              Mis Reservas
            </Link>
          </div>
        </div>

        {/* Columna derecha: Botón login/cerrar sesión */}
        <div className="flex-shrink-0">
          {!rol ? (
            <Link
              href="/logIn"
              className="bg-amber-900 text-white px-4 py-3 rounded hover:bg-amber-800 transition"
            >
              Iniciar Sesión
            </Link>
          ) : (
            <CerrarSesionButton />
          )}
        </div>

      </div>
    </nav>
  );
}
