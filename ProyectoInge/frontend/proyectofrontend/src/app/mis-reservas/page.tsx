// app/mis-reservas/page.tsx
"use client";

import { useState } from "react";
import CancelarReservaPage from "@/components/CancelarReserva";
import { Button } from "@/components/ui/button";

export default function MisReservas() {
  const [mostrarFormularioCancelacion, setMostrarFormularioCancelacion] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>
      <p className="text-gray-600 mb-6 text-center">
        Aquí podrás ver un resumen de tus reservas activas (próximamente).
      </p>

      <Button
        onClick={() => setMostrarFormularioCancelacion(!mostrarFormularioCancelacion)}
        className="bg-amber-800 hover:bg-amber-900 text-white shadow-md mb-8"
      >
        Cancelar una Reserva
      </Button>

      {mostrarFormularioCancelacion && <CancelarReservaPage />}

      <div className="mt-8 p-4 bg-white rounded-lg shadow-md w-full max-w-2xl text-center">
      </div>
    </div>
  );
}