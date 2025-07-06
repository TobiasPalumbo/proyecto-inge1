// app/cancelar-reserva/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CancelarReservaPage() {
  const [codigoReserva, setCodigoReserva] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null); 
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null); 
  const router = useRouter();

  const handleSubmitCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelError(null); 
    setCancelSuccess(null);

    if (!codigoReserva) {
      setCancelError("Por favor, ingresa el código de reserva.");
      return;
    }

    const idReservaNumero = parseInt(codigoReserva, 10);

    if (isNaN(idReservaNumero) || idReservaNumero <= 0) {
      setCancelError("El código de reserva debe ser un número válido y positivo.");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`http://localhost:8080/cancelarReserva`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ idReserva: idReservaNumero }),
        credentials: "include",
      });

      let data: { message?: string } | string;
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Error al parsear JSON, leyendo como texto:", jsonError);
          data = await response.text();
        }
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMessage: string;
        if (typeof data === 'object' && data !== null && 'message' in data) {
          errorMessage = data.message || "Error desconocido del servidor.";
        } else if (typeof data === 'string' && data.trim().length > 0) {
          errorMessage = data;
        } else {
          errorMessage = `Error al cancelar la reserva: La petición falló con estado ${response.status}.`;
        }
        setCancelError(errorMessage);
        } else {
        let successMessage: string;
        if (typeof data === 'object' && data !== null && 'message' in data) {
          successMessage = data.message || "Reserva cancelada exitosamente.";
        } else if (typeof data === 'string' && data.trim().length > 0) {
          successMessage = data;
        } else {
          successMessage = "Reserva cancelada exitosamente.";
        }

        setCancelSuccess(successMessage); 
        setCodigoReserva(""); 
      }
    } catch (err: any) {
      setCancelError(err.message || "Ocurrió un error inesperado al cancelar la reserva.");
      console.error("Error inesperado en fetch:", err);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-2 py-10">
      <Card className="w-[600px] shadow-lg border shadow-amber-950/85 bg-amber-50/65 relative">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmitCancel}
            className="flex flex-col gap-4 w-full"
            id="cancel-form"
          >
            <h2 className="text-lg font-semibold text-center mb-4 text-black">
              Ingresa el Código de Cancelación
            </h2>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="cancelCodigoReserva" className="text-black text-sm">
                Código de Reserva
              </Label>
              <Input
                type="text"
                id="cancelCodigoReserva"
                value={codigoReserva}
                onChange={(e) => setCodigoReserva(e.target.value)}
                placeholder="Ej: 123456"
                required
                className="w-full max-w-sm bg-white text-black border-gray-400"
              />
              {cancelError && <p className="text-red-500 text-sm mt-2">{cancelError}</p>}
              {cancelSuccess && <p className="text-green-600 text-sm mt-2 font-semibold">{cancelSuccess}</p>}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="button"
                onClick={() => router.push("/mis-reservas")}
                className="bg-gray-500 hover:bg-gray-600 text-white shadow-md w-full sm:w-auto"
              >
                Volver
              </Button>
              
              <Button
                type="submit"
                disabled={isCancelling}
                className="bg-amber-800 hover:bg-amber-900 text-white shadow-md w-full sm:w-auto"
              >
                {isCancelling ? "Cancelando..." : "Cancelar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}