"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await fetch("http://localhost:8080/public/cliente");
        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, []);

  const handleVerReservas = () => {
    router.push("/mis-reservas");
  };

  if (cargando) {
    return <div className="text-center mt-10">Cargando perfil...</div>;
  }

  if (!usuario) {
    return (
      <div className="text-center mt-10 text-red-500">
        No se pudo cargar el perfil
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Mi Perfil</h2>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">Nombre:</span> {usuario.nombre}
        </p>
        <p>
          <span className="font-semibold">Apellido:</span> {usuario.apellido}
        </p>
        <p>
          <span className="font-semibold">Correo:</span> {usuario.correo}
        </p>
        <p>
          <span className="font-semibold">Fecha de nacimiento:</span>{" "}
          {usuario.fechaNacimiento}
        </p>
        <p>
          <span className="font-semibold">Fecha de registro:</span>{" "}
          {usuario.fechaRegistro}
        </p>
      </div>

      <Button
        onClick={handleVerReservas}
        className="w-full bg-amber-900 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded-xl mt-4"
      >
        Ver reservas
      </Button>
    </div>
  );
}
