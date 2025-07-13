"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  estado: string; // La variable que se utilizará para el estado del alquiler
  fechaEntrega: string; // Asumiendo string en formato "YYYY-MM-DD"
  fechaRegreso: string; // Asumiendo string en formato "YYYY-MM-DD"
  horaEntrega: string; // Asumiendo string en formato "HH:MM:SS"
  horaRegreso: string; // Asumiendo string en formato "HH:MM:SS"
};

type PaqueteExtraDTO = {
  idPaquete: number;
  tipoPaquete: string;
  precio: number;
  cantidad: number;
};

type AlquilerDTO = {
  idAlquiler: number;
  estadoAlquiler: string; // Este es el estado relevante para tu botón
  precio: number;
  precioExtra: number;
  diaHoy: string;
  horaHoy: string;
  reserva: ReservaDTO;
  paquetesExtras: PaqueteExtraDTO[];
};


export default function VerDevolucionesTable() {
  const [devoluciones, setDevoluciones] = useState<AlquilerDTO[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const router = useRouter(); 

  const displayDevoluciones = useMemo(() => {
    let current = [...devoluciones];
    if (!mostrarHistorial) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log(today)
      current = current.filter((a) => {
        const fechaRegreso = new Date(a.reserva.fechaRegreso+"T00:00:00");
        fechaRegreso.setHours(0, 0, 0, 0);
         console.log(a.reserva.fechaRegreso)
         console.log(fechaRegreso)
        return fechaRegreso.getTime() === today.getTime();
      });
    }
    return current.sort((a, b) =>
      b.reserva.fechaRegreso.localeCompare(a.reserva.fechaRegreso)
    );
  }, [devoluciones, mostrarHistorial]);

  const handleBuscarDevoluciones = async () => {
    setCargando(true);
    setErrorMensaje(null);
    setDevoluciones([]);

    try {
      const response = await fetch(
        "http://localhost:8080/empleado/verDevoluciones",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setDevoluciones([]);
        setErrorMensaje(
          "No se encontraron devoluciones para la sucursal seleccionada."
        );
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error en la solicitud: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(data)
      setDevoluciones(data.alquileres);
    } catch (error: any) {
      setDevoluciones([]);
      setErrorMensaje(`Error al cargar devoluciones: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  useEffect(() => {
    handleBuscarDevoluciones();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-amber-800 mb-6 text-center">
        Panel de Devoluciones
      </h1>

      <div className="flex items-center space-x-2 mb-6 justify-center">
        <Switch
          id="show-history"
          checked={mostrarHistorial}
          onCheckedChange={setMostrarHistorial}
          className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-gray-300"
        />
        <Label htmlFor="show-history" className="text-gray-700 font-medium">
          Mostrar Historial de Devoluciones
        </Label>
      </div>
      {errorMensaje && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMensaje}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-yellow-300 shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-400/70">
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 ">
                ID Alquiler
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 ">
                ID Reserva
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 ">
                Auto
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 ">
                Categoría
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Paquetes Extras
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Fecha de Regreso
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-xs  text-amber-950 uppercase border-r border-yellow-500">
                Precio
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500 ">
                Estado
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider">
                
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  Cargando devoluciones...
                </TableCell>
              </TableRow>
            ) : displayDevoluciones.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No se encontraron devoluciones.
                </TableCell>
              </TableRow>
            ) : (
              displayDevoluciones.map((alquiler) => (
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
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
                    {alquiler.paquetesExtras &&
                    alquiler.paquetesExtras.length > 0
                      ? alquiler.paquetesExtras
                          .map((p) => p.tipoPaquete)
                          .join(", ")
                      : "Ninguno"}
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
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    ${alquiler.precio}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    <span
                      className={
                        alquiler.estadoAlquiler === "Finalizado"
                          ? "text-orange-500 font-semibold"
                          : "text-gray-800"
                      }
                    >
                      {alquiler.estadoAlquiler}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center px-4 py-3 border-r border-yellow-200 text-sm">
                  <button
                    onClick={() =>
                      router.push(`devoluciones/registro-devolucion/${alquiler.idAlquiler}`)
                    }
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 text-sm"
                  >
                    Registrar Devolución
                  </button>
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
