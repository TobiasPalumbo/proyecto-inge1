"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface EmpleadoDTO {
  idEmpleado: number;
  nombre: string;
  apellido: string;
  cuil: string;
  correo: string;
  idSucursal: number;
  Localidad: string;
  direccion: string;
}

export default function MisEmpleadosPage() {
  const router = useRouter();
  const [empleados, setEmpleados] = useState<EmpleadoDTO[]>([]);
  const [estaEliminando, setEstaEliminando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] =
    useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] =
    useState<EmpleadoDTO | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | ""
  >("");
  const [error, setError] = useState<string | null>(null);

  const handleAddEmpleado = () => {
    router.push("/dashboard-admin/empleados/subirEmpleado");
  };

  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/admin/listarEmpleados",
        { credentials: "include" }
      );

      if (response.status === 204) {
        setEmpleados([]);
      } else if (!response.ok) {
        const errorText = await response.text();
        setError(
          `Error al cargar empleados: ${errorText || response.statusText}`
        );
        return;
      } else {
        const data: EmpleadoDTO[] = await response.json();
        setEmpleados(data);
      }
    } catch (err: any) {
      console.error("Error fetching empleados:", err);
      setError(`No se pudieron cargar los empleados: ${err.message}`);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const handleClickEliminar = (empleado: EmpleadoDTO) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalConfirmacion(true);
    setShowNotification(false);
    setNotificationMessage("");
    setNotificationType("");
  };

  const confirmarEliminacion = async () => {
    if (!empleadoAEliminar) return;

    setEstaEliminando(true);
    setMostrarModalConfirmacion(false);

    try {
      const response = await fetch("http://localhost:8080/admin/bajaEmpleado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idEmpleado: empleadoAEliminar.idEmpleado }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        setNotificationMessage(
          errorText || "Error desconocido al dar de baja el empleado."
        );
        setNotificationType("error");
        setShowNotification(true);
        return;
      }

      setNotificationMessage("¡El empleado ha sido dado de baja exitosamente!");
      setNotificationType("success");
      setShowNotification(true);
      fetchEmpleados();
    } catch (err: any) {
      setNotificationMessage(
        `Error de conexión: ${
          err.message || "No se pudo conectar con el servidor."
        }`
      );
      setNotificationType("error");
      setShowNotification(true);
    } finally {
      setEstaEliminando(false);
      setEmpleadoAEliminar(null);

      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
        setNotificationType("");
      }, 3000);
    }
  };

  const cancelarEliminacion = () => {
    setMostrarModalConfirmacion(false);
    setEmpleadoAEliminar(null);
    setShowNotification(false);
    setNotificationMessage("");
    setNotificationType("");
  };

  return (
    <>
      <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Lista de Empleados</h1>
        <div className="flex justify-end mb-8">
          <Button
            onClick={handleAddEmpleado}
            className="bg-amber-600 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 text-base"
          >
            + Agregar Empleado
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-yellow-300 shadow-md w-full max-w-7xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-400/70">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Nombre
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Apellido
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  CUIL
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Correo Electrónico
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Sucursal
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-yellow-200">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500 text-lg"
                  >
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin mr-2" size={24} />{" "}
                      Cargando empleados...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-red-600 text-lg"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : empleados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500 text-lg"
                  >
                    No hay empleados para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                empleados.map((empleado, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {empleado.nombre}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {empleado.apellido}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {empleado.cuil}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {empleado.correo}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {empleado.Localidad}, {empleado.direccion}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-center">
                      <Button
                        onClick={() => handleClickEliminar(empleado)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-md shadow-lg transition-colors duration-200 text-sm"
                        disabled={estaEliminando}
                      >
                        Dar de Baja
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {mostrarModalConfirmacion && empleadoAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-amber-950/40 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center border-gray-500 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas dar de baja al empleado:
              <br />
              <span className="font-semibold text-gray-800">
                {empleadoAEliminar.nombre} {empleadoAEliminar.apellido}
              </span>
              ?
            </p>

            {estaEliminando && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="animate-spin mr-2" size={20} /> Procesando...
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={cancelarEliminacion}
                disabled={estaEliminando}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarEliminacion}
                disabled={estaEliminando}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                {estaEliminando ? "Dando de baja..." : "Dar de Baja"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN */}
      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-amber-950/40 bg-opacity-50 z-50 p-4">
          <div
            className={`max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3 ${
              notificationType === "success"
                ? "border border-green-300"
                : "border border-red-300"
            }`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            )}
            <div>
              <h3
                className={`font-semibold text-xl ${
                  notificationType === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {notificationType === "success" ? "¡Éxito!" : "¡Error!"}
              </h3>
              <p className="text-md text-gray-700">{notificationMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
