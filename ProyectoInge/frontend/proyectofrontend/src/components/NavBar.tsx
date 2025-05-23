"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CerrarSesionButton from "./CerrarSesionBoton";
import { useEffect, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [rol, setRol] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);
  }, []);

  if (!mounted) return null; // <- Evita render hasta que esté en el cliente

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-amber-900 shadow-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo AlquilApp Car"
              width={130}
              height={140}
              priority
            />
          </Link>
        </div>

        {/* Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-10 text-xl font-semibold">
            <Link
              href="/miperfil"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/miperfil")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Mi perfil
            </Link>
            <Link
              href="/sucursales"
              className={`hover:text-amber-900 transition-colors ${
                pathname === "/sucursales"
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Sucursales
            </Link>
            <Link
              href="/flota"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/flota")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Flota
            </Link>
            <Link
              href="/mis-reservas"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/mis-reservas")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Mis Reservas
            </Link>
          </div>
        </div>

        {/* Botón login/logout */}
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
