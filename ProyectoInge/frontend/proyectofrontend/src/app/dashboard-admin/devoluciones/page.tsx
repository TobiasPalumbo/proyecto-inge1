"use client";

import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
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
  estadoAlquiler: string; // Este es el estado relevante para tu botón
  precio: number;
  reserva: ReservaDTO;
  paquetesExtras: PaqueteExtraDTO[];
};

export default function VerDevolucionesTable() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>("");
  const [devoluciones, setDevoluciones] = useState<AlquilerDTO[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const router = useRouter();

  const displayDevoluciones = useMemo(() => {
    let current = [...devoluciones];
    if (!mostrarHistorial) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      current = current.filter((a) => {
        const fechaRegreso = new Date(a.reserva.fechaRegreso+"T00:00:00");
        fechaRegreso.setHours(0, 0, 0, 0);
        return fechaRegreso.getTime() === today.getTime();
      });
    }
    return current.sort((a, b) =>
      b.reserva.fechaRegreso.localeCompare(a.reserva.fechaRegreso)
    );
  }, [devoluciones, mostrarHistorial]);

  useEffect(() => {
    fetch("http://localhost:8080/public/sucursales")
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data: Sucursal[]) => setSucursales(data))
      .catch(() =>
        setErrorMensaje(
          "No se pudieron cargar las sucursales. Verifique la conexión al servidor."
        )
      );
  }, []);

  const handleSucursalChange = (value: string) => {
    setSucursalSeleccionada(value);
    setErrorMensaje(null);
  };

  const handleBuscarDevoluciones = async () => {
    if (!sucursalSeleccionada) {
      setErrorMensaje("Por favor, seleccione una sucursal.");
      return;
    }
    setCargando(true);
    setErrorMensaje(null);
    setDevoluciones([]);

    try {
      const response = await fetch(
        "http://localhost:8080/admin/verDevolucionesPorSucursal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ idSucursal: parseInt(sucursalSeleccionada) }),
        }
      );

      if (response.status === 204) {
        setErrorMensaje(
          "No se encontraron devoluciones para la sucursal seleccionada."
        );
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        let msg = `Error en la solicitud: ${response.status}`;
        try {
          const json = JSON.parse(text);
          msg = json.message || json.error || msg;
        } catch {
          msg = text || msg;
        }
        throw new Error(msg);
      }

      const data: AlquilerDTO[] = await response.json();
      setDevoluciones(data);
    } catch (error: any) {
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-amber-800 mb-6 text-center">
        Panel de Devoluciones por Sucursal
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
          onClick={handleBuscarDevoluciones}
          disabled={!sucursalSeleccionada || cargando}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            "Ver devoluciones"
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
              <TableHead className="text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                ID Alquiler
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                ID Reserva
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Auto
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Categoría
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-amber-950 uppercase border-r border-yellow-500">
                Paquetes Extras
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-amber-950 uppercase border-r border-yellow-500">
                Regreso
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500">
                Estado
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-amber-950 uppercase border-r border-yellow-500"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  Cargando devoluciones...
                </TableCell>
              </TableRow>
            ) : displayDevoluciones.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
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
                  <TableCell className="px-4 py-3 border-r border-yellow-200 font-bold text-gray-800">
                    {alquiler.idAlquiler}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    {alquiler.reserva.idReserva}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    {alquiler.reserva.auto.marca}{" "}
                    {alquiler.reserva.auto.modelo}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    {alquiler.reserva.auto.categoria}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    {alquiler.paquetesExtras?.length
                      ? alquiler.paquetesExtras
                          .map((p) => p.tipoPaquete)
                          .join(", ")
                      : "Ninguno"}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    {alquiler.reserva.fechaRegreso} -{" "}
                    {formatTime(alquiler.reserva.horaRegreso)}
                    <br />
                    <span className="text-xs text-gray-600">
                      ({alquiler.reserva.sucursalRegreso.localidad},{" "}
                      {alquiler.reserva.sucursalRegreso.direccion})
                    </span>
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
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-sm">
                    <Button
                      variant="outline"
                      disabled={alquiler.estadoAlquiler === "finalizado"}
                      className={`font-bold py-1 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out transform ${
                        alquiler.estadoAlquiler === "finalizado"
                          ? "bg-orange-100 text-orange-500 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105"
                      }`}
                      onClick={() =>
                        router.push(
                          `/dashboard-admin/devoluciones/${alquiler.idAlquiler}`
                        )
                      }
                    >
                      Registrar Devolución{" "}
                    </Button>
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