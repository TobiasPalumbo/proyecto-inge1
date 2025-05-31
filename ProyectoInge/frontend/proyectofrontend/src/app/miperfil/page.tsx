"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Usuario = {
  nombre: string;
  apellido: string;
  correo: string;
  fechaNacimiento: string;
  fechaRegistro: string;
};

export default function PaginaPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await fetch("http://localhost:8080/usuario/perfil", {
          credentials: "include",
        });

        if (!response.ok) {
          let errorMessage = "Error al obtener el perfil del usuario.";
          try {
            const errorBody = await response.json();
            if (errorBody.message) {
              errorMessage = errorBody.message;
            } else if (response.status === 401) {
              errorMessage = "No autorizado. Por favor, inicia sesión.";
            } else if (response.status === 404) {
              errorMessage = "Perfil no encontrado.";
            }
          } catch (e) {
            // Error al parsear JSON, se usa el mensaje por defecto
          }
          throw new Error(errorMessage);
        }

        const data: Usuario = await response.json();
        console.log("Datos del perfil recibidos:", data);
        setUsuario(data);
      } catch (error: any) {
        console.error("Error en la carga del perfil:", error);
        setErrorCarga(error.message || "Ocurrió un error inesperado.");
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, []);

  const handleVerReservas = () => {
    router.push("/mis-reservas");
  };

  const handleVerAlquileres = () => {
    router.push("/mis-alquileres");
  };

  if (cargando) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Cargando perfil...</div>;
  }

  if (errorCarga) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="max-w-md w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md text-center">
          <p className="font-bold mb-2">Error al cargar el perfil:</p>
          <p>{errorCarga}</p>
          {errorCarga.includes("No autorizado") && (
            <Button
              onClick={() => router.push("/login")}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Ir a Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="max-w-md w-full bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg shadow-md text-center">
          <p className="font-bold mb-2">Problema al cargar el perfil:</p>
          <p>No se pudieron obtener los datos del usuario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-100 py-4 px-4 sm:px-6 lg:px-7 flex flex-col items-center relative"> 
      <Button
        className="fixed top-4 left-4 z-50 px-6 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition duration-200 shadow-lg" 
        onClick={() => router.push("/pagina-inicio")}
      >
        ← Volver a Inicio
      </Button>

    
      <div className="w-full max-w-3xl mt-16"> 
        
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-400">
        
          <div className="py-6 px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-amber-950 text-center">Mi Perfil</h2>
          </div>

          <div className="px-4 py-6 sm:p-8">
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <span className="font-semibold text-lg text-gray-800">Nombre:</span>
                <span className="text-md font-normal">{usuario.nombre}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <span className="font-semibold text-lg text-gray-800">Apellido:</span>
                <span className="text-md font-normal">{usuario.apellido}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <span className="font-semibold text-lg text-gray-800">Correo:</span>
                <span className="text-md font-normal">{usuario.correo}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <span className="font-semibold text-lg text-gray-800">Fecha de nacimiento:</span>
                <span className="text-md font-normal">{new Date(usuario.fechaNacimiento).toLocaleDateString("es-AR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-800">Fecha de registro:</span>
                <span className="text-md font-normal">{new Date(usuario.fechaRegistro).toLocaleDateString("es-AR")}</span>
              </div>
            </div>
          </div>

          {/* Sección de Botones */}
          <div className="bg-gray-50 px-4 py-6 xs:px-8 flex flex-row gap-4 border-t border-gray-200 justify-center flex-wrap">            <Button
              onClick={handleVerReservas}
              // Eliminamos w-full para que no ocupen todo el ancho
              className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wide max-w-sm" // max-w-sm para controlar el ancho máximo
            >
              Ver mis reservas
            </Button>
            <Button
              onClick={handleVerAlquileres}
              // Eliminamos w-full para que no ocupen todo el ancho
              className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wide max-w-sm" // max-w-sm para controlar el ancho máximo
            >
              Ver mis alquileres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}