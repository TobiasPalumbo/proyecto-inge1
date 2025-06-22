"use client";

import { useEffect, useState } from "react";
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

type Reserva = {
  idReserva: number;
  estado: string;
  fechaEntrega: string;
  horaEntrega: string;
  sucursalEntrega: {
    localidad: string;
    direccion: string;
  };
  sucursalRegreso: {
    localidad: string;
    direccion: string;
  };
  auto: {
    marca: string;
    modelo: string;
    categoria: string;
  };
};

export default function EntregasSucursalTable() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>("");
  const [entregas, setEntregas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const router = useRouter();
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/public/sucursales")
      .then((res) => res.json())
      .then((data: Sucursal[]) => setSucursales(data))
      .catch(() =>
        setErrorMensaje("Error al cargar las sucursales desde el servidor.")
      );
  }, []);

  const handleSucursalChange = (value: string) => {
    setSucursalSeleccionada(value);
    setErrorMensaje(null);
  };

  const handleBuscarEntregas = async () => {
    if (!sucursalSeleccionada) {
      setErrorMensaje("Por favor, seleccione una sucursal.");
      return;
    }

    setCargando(true);
    setErrorMensaje(null);
    setEntregas([]);

    try {
      const response = await fetch(
        "http://localhost:8080/empleado/verEntregas",
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
        setEntregas([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Error al obtener entregas");
      }

      const data: Reserva[] = await response.json();
      setEntregas(data);
      setBusquedaRealizada(true);
    } catch (error: any) {
      setErrorMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hh, mm] = timeString.split(":");
    return `${hh}:${mm}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-amber-800 mb-6 text-center">
        Entregas programadas para hoy
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
          onClick={handleBuscarEntregas}
          disabled={!sucursalSeleccionada || cargando}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            "Ver entregas"
          )}
        </Button>
      </div>

      {errorMensaje && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMensaje}</span>
        </div>
      )}
      <div className="rounded-lg border border-amber-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-400/70">
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">
                ID Reserva
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">
                Auto
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Categoría
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Hora de Entrega
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Sucursal Entrega
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                Sucursal Devolución
              </TableHead>
              <TableHead className="px-1 py-1 text-center text-sm font-bold text-amber-950 uppercase tracking-wider"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center align-middle py-10 text-gray-500 text-lg"
                >
                  Cargando entregas...
                </TableCell>
              </TableRow>
            ) : entregas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No hay entregas programadas para hoy.
                </TableCell>
              </TableRow>
            ) : (
              entregas.map((reserva) => (
                <TableRow
                  key={reserva.idReserva}
                  className="border-b border-yellow-300 odd:bg-gray-50 hover:bg-yellow-50 transition-colors duration-150"
                >
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.idReserva}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.auto.marca} {reserva.auto.modelo}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.auto.categoria}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {formatTime(reserva.horaEntrega)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.sucursalEntrega.localidad} -{" "}
                    {reserva.sucursalEntrega.direccion}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.sucursalRegreso.localidad} -{" "}
                    {reserva.sucursalRegreso.direccion}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      onClick={() =>
                        router.push(
                          `/empleado/registrarEntrega?id=${reserva.idReserva}`
                        )
                      }
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 text-sm"
                    >
                      Registrar Entrega
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
