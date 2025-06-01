"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
type Props = {
  autoId: number;
  auto: {
    marca: string;
    modelo: string;
    precio: number;
    categoria: string;
    cantidadAsientos: number;
  };
  sucursalRetiroNombre: string;
  sucursalDevolucionNombre: string;
  fechaEntrega: string;
  fechaRegreso: string;
  horaEntrega: string;
  horaRegreso: string;
  politicaCancelacion: number;
  autoImageUrl: string;
};

export function SimularPresupuestoDialog({
  autoId,
  auto,
  sucursalRetiroNombre,
  sucursalDevolucionNombre,
  fechaEntrega,
  fechaRegreso,
  horaEntrega,
  horaRegreso,
  politicaCancelacion,
  autoImageUrl,
}: Props) {
  const [open, setOpen] = useState(false);
  const [precio, setPrecio] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function simularPresupuesto() {
    setLoading(true);
    setPrecio(null);

    try {
      const res = await fetch("http://localhost:8080/public/simularPresupuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: autoId, fechaEntrega, fechaRegreso }),
      });

      if (!res.ok) {
        let errorMessage = "Error desconocido al simular presupuesto.";
        try {
          const errorBody = await res.json();
          if (errorBody?.message) errorMessage = errorBody.message;
          else {
            const textError = await res.text();
            if (textError) errorMessage = `Error: ${textError}`;
          }
        } catch {
          errorMessage = `Error de red o formato inesperado. Código: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setPrecio(data.presupuesto);
    } catch (err: any) {
      console.error("Error en la simulación:", err.message);
      alert(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) simularPresupuesto();
    else setPrecio(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-amber-800 hover:bg-amber-900 text-white">
          Simular presupuesto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Presupuesto estimado</DialogTitle>
          <DialogDescription>Detalles de tu reserva simulada</DialogDescription>
        </DialogHeader>
        <Image
  src={autoImageUrl}
  alt="Imagen del auto"
  width={200}
  height={150}
  className="rounded-xl object-cover mb-4"
/>
<div className="mb-1">
  <h3 className="text-lg font-semibold mb-1">
    {auto.marca} {auto.modelo}
  </h3>
  <p className="text-sm text-gray-700">Categoría: {auto.categoria}</p>
  <p className="text-sm text-gray-700">Asientos: {auto.cantidadAsientos}</p>
  <p className="text-sm text-gray-700">Precio por día: ${auto.precio}</p>
   <p className="text-sm text-gray-700">Politíca de cancelación: Se reintegra {politicaCancelacion * 100}%</p>
          <p className="text-sm text-gray-700">Sucursal de retiro: {sucursalRetiroNombre}</p>
          <p className="text-sm text-gray-700">Sucursal de devolución: {sucursalDevolucionNombre}</p>
          <p className="text-sm text-gray-700">Fecha y hora de retiro: {fechaEntrega} - {horaEntrega}</p>
          <p className="text-sm text-gray-700">Fecha y hora de devolución: {fechaRegreso} - {horaRegreso}</p>
          {loading ? (
            <p className="text-amber-700">Calculando presupuesto...</p>
          ) : precio !== null && (
            <p className="text-lg font-semibold mt-4 text-amber-900">
              Precio total estimado: ${precio}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
