"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- TIPOS ---
type Sucursal = {
  idSucursal: number;
  localidad: string;
  direccion: string;
};

type AutoDTO = {
  idAuto: number;
  idCategoria: number;
  marca: string;
  modelo: string;
  precio: number;
  cantidadAsientos: number;
  categoria: string;
  idPoliticaCancelacion: number;
  porcentaje: number;
};

type ReservaDTO = {
  idReserva: number;
  sucursalEntrega: Sucursal;
  sucursalRegreso: Sucursal;
  auto: AutoDTO;
  estado: string;
  fechaEntrega: string;
  fechaRegreso: string;
  horaEntrega: string;
  horaRegreso: string;
};

type PaqueteExtraDTO = {
  idPaquete: number;
  tipoPaquete: string;
  precio: number;
  cantidad: number;
};

type AlquilerDTO = {
  idAlquiler: number;
  precio: number;
  estadoAlquiler: string;
  reserva: ReservaDTO;
  paquetesExtras: PaqueteExtraDTO[];
};

export default function AlquileresSucursalTable() {
  const [alquileres, setAlquileres] = useState<AlquilerDTO[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  const displayAlquileres = useMemo(() => {
    return [...alquileres].sort((a, b) =>
      b.reserva.fechaEntrega.localeCompare(a.reserva.fechaEntrega)
    );
  }, [alquileres]);

  useEffect(() => {
    const fetchAlquileres = async () => {
      setCargando(true);
      setErrorMensaje(null);

      try {
        const response = await fetch(
          "http://localhost:8080/empleado/verAlquileres",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 204) {
          setAlquileres([]);
          setErrorMensaje(
            "No se encontraron alquileres para tu sucursal asignada."
          );
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Error desconocido");
        }

        const data = await response.json();
        setAlquileres(data.alquileres || []);
      } catch (error: any) {
        setErrorMensaje(`Error al cargar alquileres: ${error.message}`);
        setAlquileres([]);
      } finally {
        setCargando(false);
      }
    };

    fetchAlquileres();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-amber-800 mb-6 text-center">
        Panel de Alquileres
      </h1>

      {errorMensaje && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMensaje}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-yellow-300 shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-400/70">
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                ID Alquiler
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                ID Reserva
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Auto
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Categoría
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Precio Total
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase border-r border-yellow-500">
                Paquetes Extras
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase border-r border-yellow-500">
                Entrega
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase border-r border-yellow-500">
                Regreso
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  <Loader2 className="animate-spin inline mr-2" /> Cargando
                  alquileres...
                </TableCell>
              </TableRow>
            ) : displayAlquileres.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No se encontraron alquileres.
                </TableCell>
              </TableRow>
            ) : (
              displayAlquileres.map((alquiler) => (
                <TableRow
                  key={alquiler.idAlquiler}
                  className="border-b border-yellow-300 odd:bg-gray-50 hover:bg-yellow-50 transition-colors duration-150"
                >
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-bold">
                    {alquiler.idAlquiler}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-medium">
                    {alquiler.reserva.idReserva}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-medium">
                    {alquiler.reserva.auto.marca} {alquiler.reserva.auto.modelo}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
                    {alquiler.reserva.auto.categoria}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-semibold">
                    ${alquiler.precio.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
                    {alquiler.paquetesExtras?.length > 0
                      ? alquiler.paquetesExtras
                          .map((p) => p.tipoPaquete)
                          .join(", ")
                      : "Ninguno"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {alquiler.reserva.fechaEntrega} -{" "}
                    {formatTime(alquiler.reserva.horaEntrega)}
                    <br />
                    <span className="text-gray-600 text-xs">
                      ({alquiler.reserva.sucursalEntrega.localidad},{" "}
                      {alquiler.reserva.sucursalEntrega.direccion})
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {alquiler.reserva.fechaRegreso} -{" "}
                    {formatTime(alquiler.reserva.horaRegreso)}
                    <br />
                    <span className="text-gray-600 text-xs">
                      ({alquiler.reserva.sucursalRegreso.localidad},{" "}
                      {alquiler.reserva.sucursalRegreso.direccion})
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm font-semibold text-center text-gray-800">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        alquiler.estadoAlquiler === "finalizado"
                          ? "bg-amber-200 text-amber-600" 
                          : alquiler.estadoAlquiler === "confirmado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {alquiler.estadoAlquiler}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}