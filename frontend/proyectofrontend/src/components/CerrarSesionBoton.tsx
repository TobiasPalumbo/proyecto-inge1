"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 

export default function CerrarSesionButton() {
  const router = useRouter();
  const { logout } = useAuth(); 

  const handleCerrarSesion = async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      try {
        await fetch("http://localhost:8080/custom-logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error al cerrar sesión en el backend:", error);
      }

      logout();
      router.push("/pagina-inicio");
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
