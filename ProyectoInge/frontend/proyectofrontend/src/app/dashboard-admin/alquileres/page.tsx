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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>("");
  const [alquileres, setAlquileres] = useState<AlquilerDTO[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/public/sucursales")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Sucursal[]) => setSucursales(data))
      .catch((err) => {
        setErrorMensaje(
          "No se pudieron cargar las sucursales. Verifique la conexión al servidor."
        );
      });
  }, []);

  const handleSucursalChange = (value: string) => {
    setSucursalSeleccionada(value);
    setErrorMensaje(null);
  };

  const handleBuscarAlquileres = async () => {
    if (!sucursalSeleccionada || sucursalSeleccionada === "") {
      setErrorMensaje("Por favor, seleccione una sucursal.");
      return;
    }
    setCargando(true);
    setErrorMensaje(null);
    setAlquileres([]);

    try {
      const response = await fetch(
        "http://localhost:8080/admin/verAlquileresPorSucursal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ idSucursal: parseInt(sucursalSeleccionada) }),
        }
      );

      if (response.status === 204) {
        setAlquileres([]);
        setErrorMensaje(
          "No se encontraron alquileres para la sucursal seleccionada."
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

      const data: AlquilerDTO[] = await response.json();
      setAlquileres(data);
    } catch (error: any) {
      setAlquileres([]);
      setErrorMensaje(`Error al cargar alquileres: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  const displayAlquileres = useMemo(() => {
    return [...alquileres].sort((a, b) => {
      const dateComparison = b.reserva.fechaEntrega.localeCompare(a.reserva.fechaEntrega);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return b.reserva.horaEntrega.localeCompare(a.reserva.horaEntrega);
    });
  }, [alquileres]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-amber-800 mb-6 text-center">
        Panel de Alquileres por Sucursal
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 justify-center">
        <Select
          value={sucursalSeleccionada}
          onValueChange={handleSucursalChange}
        >
          <SelectTrigger className="w-[250px] bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="Seleccionar sucursal" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {sucursales.map((s) => (
              <SelectItem key={s.idSucursal} value={String(s.idSucursal)}>
                {s.localidad} - {s.direccion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleBuscarAlquileres}
          disabled={!sucursalSeleccionada || cargando}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando...
            </>
          ) : (
            "Ver alquileres"
          )}
        </Button>
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
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 ">
                Precio Total 
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Paquetes Extras
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Entrega
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Regreso
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 ">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={9} 
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  Cargando alquileres...
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
                    {alquiler.reserva.auto.marca}{" "}
                    {alquiler.reserva.auto.modelo}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
                    {alquiler.reserva.auto.categoria}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-semibold">
                    ${alquiler.precio.toFixed(2)}
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
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
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