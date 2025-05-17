"use client";

import { useRouter } from "next/navigation";

export default function CerrarSesionButton() {
  const router = useRouter();

  const handleCerrarSesion = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("rol");
      localStorage.removeItem("correo");
      router.push("/pagina-inicio"); // o la ruta donde quieras enviar al usuario
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
