"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CerrarSesionButton from "./CerrarSesionBoton";
import { useAuth } from "@/context/AuthContext"; // 

export default function NavBar() {
  const pathname = usePathname();
  const { rol, loading, adminVerificado} = useAuth(); // 

  if (loading) return null; 

  return (
    <nav className="sticky top-0 z-50 border-b-4 bg-amber-50/89 border-amber-900 shadow-amber-700">
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
            {rol === "admin" && adminVerificado &&
            <Link
              href="/dashboard-admin"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/dashboard-admin")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Panel de gestión
            </Link>
            }
            {rol === "empleado" &&
            <Link
              href="/dashboard-empleado"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/dashboard-empleado")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Panel de gestión
            </Link>
            }
            { rol=== "cliente" &&
            <Link
              href="/miperfil"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/miperfil")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Mi perfil
            </Link> }
            <Link
              href="/realizar-reserva"
              className={`hover:text-amber-900 transition-colors ${
                pathname.startsWith("/realizar-reserva")
                  ? "text-amber-800"
                  : "text-amber-900 hover:text-amber-800 hover:underline"
              }`}
            >
              Reservar
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
            <Link href="#sobre-nosotros" className="text-amber-900 hover:text-amber-800 hover:underline"> Sobre Nosotros
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
