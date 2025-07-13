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
import { Loader2, CheckCircle, XCircle } from "lucide-react";

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
  const [anulandoReservaId, setAnulandoReservaId] = useState<number | null>(
    null
  );

  const [mostrarModalConfirmacionAnular, setMostrarModalConfirmacionAnular] = useState(false);
  const [reservaParaAnularConfirmacion, setReservaParaAnularConfirmacion] = useState<Reserva | null>(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | ''>('');

  const [estaCerrandoDia, setEstaCerrandoDia] = useState(false);
  const [mostrarModalConfirmacionCerrarDia, setMostrarModalConfirmacionCerrarDia] = useState(false);
  const [reservasCargadas, setReservasCargadas] = useState(false);

  // Eliminamos los estados `mensajeCierreDia` y `tipoMensajeCierreDia`
  // porque el mensaje se mostrará con la notificación global.


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
    setShowNotification(false);
    setReservasCargadas(false);
    // Ya no es necesario limpiar los estados de mensaje de cierre de día aquí
  };

  const handleBuscarReservas = async () => {
    if (!sucursalSeleccionada || sucursalSeleccionada === "") {
      setErrorMensaje("Por favor, seleccione una sucursal.");
      return;
    }
    setCargando(true);
    setErrorMensaje(null);
    setShowNotification(false);
    setReservas([]);
    setPresupuestos({});
    setReservasCargadas(false);
    // Ya no es necesario limpiar los estados de mensaje de cierre de día aquí
    
    try {
      const response = await fetch(
        "http://localhost:8080/admin/verReservasSucursal",
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
      setReservasCargadas(true);
    } catch (error: any) {
      setReservas([]);
      setErrorMensaje(`Error al cargar reservas: ${error.message}`);
      setReservasCargadas(false);
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
    setShowNotification(false);

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
        setNotificationMessage(errorMessage);
        setNotificationType('error');
        setShowNotification(true);
        return;
      }

      const data = await response.json();
      setNotificationMessage(data.message || "Reserva cancelada con éxito.");
      setNotificationType('success');
      setShowNotification(true);

      setReservas((prevReservas) =>
        prevReservas.map((res) =>
          res.idReserva === idReserva ? { ...res, estado: "cancelado" } : res
        )
      );
    } catch (error: any) {
      setNotificationMessage(`Error de conexión: ${error.message}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setCancelandoReservaId(null);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleClickAnular = (reserva: Reserva) => {
    setReservaParaAnularConfirmacion(reserva);
    setMostrarModalConfirmacionAnular(true);
    setShowNotification(false);
  };

  const confirmarAnulacion = async () => {
    if (!reservaParaAnularConfirmacion) return;

    const idReserva = reservaParaAnularConfirmacion.idReserva;
    setAnulandoReservaId(idReserva);
    setMostrarModalConfirmacionAnular(false);
    setShowNotification(false);

    try {
      const response = await fetch(
        "http://localhost:8080/empleado/anularReservaAdminEmpleado",
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
        let errorMessage = `Error al anular la reserva: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        setNotificationMessage(errorMessage);
        setNotificationType('error');
        setShowNotification(true);
        return;
      }

      const data = await response.json();
      setNotificationMessage(data.message || "Reserva anulada con éxito.");
      setNotificationType('success');
      setShowNotification(true);

      setReservas((prevReservas) =>
        prevReservas.map((res) =>
          res.idReserva === idReserva ? { ...res, estado: "anulado" } : res
        )
      );
    } catch (error: any) {
      setNotificationMessage(`Error de conexión: ${error.message}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setAnulandoReservaId(null);
      setReservaParaAnularConfirmacion(null);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const cancelarAnulacion = () => {
    setMostrarModalConfirmacionAnular(false);
    setReservaParaAnularConfirmacion(null);
    setShowNotification(false);
  };

  const handleCerrarDia = () => {
    if (!sucursalSeleccionada) {
      setErrorMensaje("Por favor, seleccione una sucursal para cerrar el día.");
      return;
    }
    // No limpiamos el mensaje de cierre de día aquí, porque lo usará el sistema de notificaciones.
    setMostrarModalConfirmacionCerrarDia(true);
  };

  const confirmarCerrarDia = async () => {
    setEstaCerrandoDia(true);
    setErrorMensaje(null);
    setShowNotification(false); // Aseguramos que la notificación esté oculta al iniciar la operación

    try {
      const response = await fetch("http://localhost:8080/admin/cerrarDia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idSucursal: parseInt(sucursalSeleccionada) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error al cerrar el día: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        setNotificationMessage(errorMessage); // Usamos la notificación global
        setNotificationType('error');
      } else {
        const data = await response.json();
        setNotificationMessage(data.message || "Día cerrado con éxito."); // Usamos la notificación global
        setNotificationType('success');
        handleBuscarReservas(); // Recargar reservas después de cerrar el día
      }
      setShowNotification(true); // Mostrar la notificación después de recibir la respuesta
    } catch (error: any) {
      setNotificationMessage(`Error de conexión al cerrar el día: ${error.message}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setEstaCerrandoDia(false);
      setMostrarModalConfirmacionCerrarDia(false); // Cerramos el modal de confirmación
      setTimeout(() => setShowNotification(false), 3000); // Ocultar notificación después de 3 segundos
    }
  };

  const cancelarCerrarDia = () => {
    setMostrarModalConfirmacionCerrarDia(false);
    setEstaCerrandoDia(false);
    setShowNotification(false); // Aseguramos que la notificación esté oculta si se cancela
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
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

        {reservasCargadas && sucursalSeleccionada && (
          <Button
            onClick={handleCerrarDia}
            disabled={estaCerrandoDia}
            className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {estaCerrandoDia ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando Día...
              </>
            ) : (
              "Cerrar Día"
            )}
          </Button>
        )}
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
              <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-yellow-200">
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  Cargando reservas...
                </TableCell>
              </TableRow>
            ) : displayReservas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
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
                          : reserva.estado === "cancelado" || reserva.estado === "anulado" || reserva.estado === "vencido"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reserva.estado}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-center flex flex-col gap-2">
                    <Button
                      onClick={() => handleCancelarReserva(reserva.idReserva)}
                      disabled={
                        reserva.estado === "cancelado" ||
                        reserva.estado === "anulado" ||
                        reserva.estado === "confirmado" ||
                        reserva.estado === "vencido" ||
                        cancelandoReservaId === reserva.idReserva
                      }
                      className={`font-medium px-3 py-1.5 text-xs rounded-md shadow-md transition-colors duration-200 whitespace-nowrap ${
                        reserva.estado === "cancelado" || reserva.estado === "anulado" || reserva.estado === "confirmado" || reserva.estado === "vencido"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
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
                    <Button
                      onClick={() => handleClickAnular(reserva)}
                      disabled={
                        reserva.estado === "cancelado" ||
                        reserva.estado === "anulado" ||
                        reserva.estado === "confirmado" ||
                        reserva.estado === "vencido" ||
                        anulandoReservaId === reserva.idReserva
                      }
                      className={`font-medium px-3 py-1.5 text-xs rounded-md shadow-md transition-colors duration-200 whitespace-nowrap ${
                        reserva.estado === "cancelado" || reserva.estado === "anulado" || reserva.estado === "confirmado" || reserva.estado === "vencido"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }`}
                    >
                      {anulandoReservaId === reserva.idReserva ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Anulando...
                        </>
                      ) : (
                        "Anular Reserva"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {mostrarModalConfirmacionAnular && reservaParaAnularConfirmacion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-amber-950/40 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center border-gray-500 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Anulación</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas anular la reserva:
              <br />
              <span className="font-semibold text-gray-800">#{reservaParaAnularConfirmacion.idReserva}</span>
              <br />
              Se devolverá la totalidad del monto:
              <span className="font-bold text-green-700"> ${reservaParaAnularConfirmacion.precio.toFixed(2)}</span>?
            </p>

            {anulandoReservaId === reservaParaAnularConfirmacion.idReserva && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="animate-spin mr-2" size={20} /> Procesando...
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={cancelarAnulacion}
                disabled={anulandoReservaId === reservaParaAnularConfirmacion.idReserva}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarAnulacion}
                disabled={anulandoReservaId === reservaParaAnularConfirmacion.idReserva}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                {anulandoReservaId === reservaParaAnularConfirmacion.idReserva ? 'Anulando...' : 'Confirmar Anulación'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalConfirmacionCerrarDia && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-amber-950/40 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center border-gray-500 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Cierre de Día</h3>
            <p className="text-gray-700 mb-6">
                ¿Estás seguro de que deseas cerrar el día para la sucursal seleccionada?
            </p>

            {estaCerrandoDia && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="animate-spin mr-2" size={20} /> Procesando...
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={cancelarCerrarDia}
                disabled={estaCerrandoDia}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
              >
                Cancelar
              </Button>
              <Button
                  onClick={confirmarCerrarDia}
                  disabled={estaCerrandoDia}
                  className="bg-amber-800 hover:bg-amber-900 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                  Confirmar Cierre
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-amber-950/40 bg-opacity-50 z-50 p-4">
          <div className={`max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3
            ${notificationType === 'success' ? 'border border-green-300' : 'border border-red-300'}`}
          >
            {notificationType === 'success' ? (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            )}
            <div>
              <h3 className={`font-semibold text-xl ${notificationType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {notificationType === 'success' ? '¡Éxito!' : '¡Error!'}
              </h3>
              <p className="text-md text-gray-700">{notificationMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}