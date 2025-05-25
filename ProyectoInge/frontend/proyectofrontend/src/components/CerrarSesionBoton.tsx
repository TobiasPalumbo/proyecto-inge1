"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 
export default function CerrarSesionButton() {
  const router = useRouter();
  const { logout } = useAuth(); // Usar el hook del contexto

  const handleCerrarSesion = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout(); //  Limpia estado y sessionStorage
      router.push("/pagina-inicio"); // Redirige después del logout
    }
  };

  return (
    <button
      onClick={handleCerrarSesion}
      className="mt-4 bg-amber-900 text-white py-2 px-4 rounded"
    >
      Cerrar Sesión
    </button>
  );
}
