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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// --- TIPOS ---
type Sucursal = {
  idSucursal: number;
  localidad: string;
  direccion: string;
};

type Reserva = {
  idReserva: number;
  precio: number;
  estado: string;
  fechaEntrega: string;
  horaEntrega: string;
  fechaRegreso: string;
  horaRegreso: string;
  sucursalEntrega: {
    idSucursal: number;
    localidad: string;
    direccion: string;
  };
  sucursalRegreso: {
    idSucursal: number;
    localidad: string;
    direccion: string;
  };
  auto: {
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
};

type PresupuestoResponse = {
  presupuesto: number;
};

export default function ReservasSucursalTable() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>("");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false);
  const [presupuestos, setPresupuestos] = useState<{
    [idReserva: number]: number;
  }>({});
  const [cancelandoReservaId, setCancelandoReservaId] = useState<number | null>(
    null
  );
  const [cancelacionMensaje, setCancelacionMensaje] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

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
    setCancelacionMensaje({ message: "", type: "" });
  };

  const handleBuscarReservas = async () => {
    if (!sucursalSeleccionada || sucursalSeleccionada === "") {
      setErrorMensaje("Por favor, seleccione una sucursal.");
      return;
    }
    setCargando(true);
    setErrorMensaje(null);
    setCancelacionMensaje({ message: "", type: "" });
    setReservas([]);
    setPresupuestos({});

    try {
      const response = await fetch(
        "http://localhost:8080/empleado/verReservasSucursal",
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
        setReservas([]);
        setErrorMensaje(
          "No se encontraron reservas para la sucursal seleccionada."
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

      const data: Reserva[] = await response.json();
      setReservas(data);
    } catch (error: any) {
      setReservas([]);
      setErrorMensaje(`Error al cargar reservas: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  const displayReservas = useMemo(() => {
    let currentReservas = [...reservas];

    if (!mostrarHistorial) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      currentReservas = currentReservas.filter((reserva) => {
        const fechaEntrega = new Date(reserva.fechaEntrega);
        fechaEntrega.setHours(0, 0, 0, 0);

        return fechaEntrega >= today;
      });
    }

    return currentReservas.sort((a, b) => {
      return b.fechaEntrega.localeCompare(a.fechaEntrega);
    });
  }, [reservas, mostrarHistorial]);


  const handleCancelarReserva = async (idReserva: number) => {
    setCancelandoReservaId(idReserva);
    setCancelacionMensaje({ message: "", type: "" }); // Limpia mensajes de cancelación al iniciar

    try {
      const response = await fetch(
        "http://localhost:8080/empleado/cancelarReservaAdminEmpleado",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ idReserva }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error al cancelar la reserva: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setCancelacionMensaje({
        message: data.message || "Reserva cancelada con éxito.",
        type: "success",
      });

      setReservas((prevReservas) =>
        prevReservas.map((res) =>
          res.idReserva === idReserva ? { ...res, estado: "cancelado" } : res
        )
      );
    } catch (error: any) {
      setCancelacionMensaje({ message: `${error.message}`, type: "error" });
    } finally {
      setCancelandoReservaId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-amber-800 mb-6 text-center">
        Panel de Reservas por Sucursal
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
          onClick={handleBuscarReservas}
          disabled={!sucursalSeleccionada || cargando}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? "Cargando..." : "Ver reservas"}
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-6 justify-center">
        <Switch
          id="show-history"
          checked={mostrarHistorial}
          onCheckedChange={setMostrarHistorial}
          className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-gray-300"
        />
        <Label htmlFor="show-history" className="text-gray-700 font-medium">
          Mostrar Historial de Reservas
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
      {cancelacionMensaje.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 text-center ${
            cancelacionMensaje.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
          role="alert"
        >
          <strong className="font-bold">
            {cancelacionMensaje.type === "success" ? "Éxito:" : "Error:"}
          </strong>
          <span className="block sm:inline"> {cancelacionMensaje.message}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-yellow-300 shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-400/70">
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
                Política de Cancelación
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
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  Cargando reservas...
                </TableCell>
              </TableRow>
            ) : displayReservas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No se encontraron reservas{" "}
                  {mostrarHistorial ? "" : "activas/futuras"}.
                </TableCell>
              </TableRow>
            ) : (
              displayReservas.map((reserva) => (
                <TableRow
                  key={reserva.idReserva}
                  className="border-b border-yellow-300 odd:bg-gray-50 hover:bg-yellow-50 transition-colors duration-150"
                >
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-bold">
                    {reserva.idReserva}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-medium">
                    {reserva.auto.marca} {reserva.auto.modelo}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
                    {reserva.auto.categoria}
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-800 text-sm font-semibold">
                    {reserva.precio.toFixed(2)} 
                  </TableCell>
                  <TableCell className="px-4 py-3 border-r border-yellow-200 text-gray-700 text-sm">
                    {(reserva.auto.porcentaje * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.fechaEntrega} - {formatTime(reserva.horaEntrega)}{" "}
                    <br />
                    <span className="text-gray-600 text-xs">
                      ({reserva.sucursalEntrega.localidad},{" "}
                      {reserva.sucursalEntrega.direccion})
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    {reserva.fechaRegreso} - {formatTime(reserva.horaRegreso)}{" "}
                    <br />
                    <span className="text-gray-600 text-xs">
                      ({reserva.sucursalRegreso.localidad},{" "}
                      {reserva.sucursalRegreso.direccion})
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        reserva.estado === "pendiente"
                          ? "bg-blue-100 text-blue-800"
                          : reserva.estado === "confirmado"
                          ? "bg-green-100 text-green-800"
                          : reserva.estado === "cancelado"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reserva.estado}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-center">
                    <Button
  onClick={() => handleCancelarReserva(reserva.idReserva)}
  className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 text-xs rounded-md shadow-md transition-colors duration-200 whitespace-nowrap"
>
                      {cancelandoReservaId === reserva.idReserva ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelando...
                        </>
                      ) : (
                        "Cancelar Reserva"
                      )}
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
