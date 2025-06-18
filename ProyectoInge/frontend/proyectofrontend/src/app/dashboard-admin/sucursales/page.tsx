"use client";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react'; // Importar CheckCircle y XCircle

interface Sucursal {
  idSucursal: number;
  localidad: string;
  direccion: string;
}

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [sucursalAEliminar, setSucursalAEliminar] = useState<Sucursal | null>(null);
  const [estaEliminando, setEstaEliminando] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | ''>('');


  const fetchSucursales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/public/sucursales', {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error al cargar sucursales: ${errorText || response.statusText}`);
        return; }
      const data = await response.json();
      setSucursales(data);
    } catch (err: any) {
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleAddSucursal = () => {
    router.push('/dashboard-admin/sucursales/subirSucursal');
  }

  const handleClickEliminar = (sucursal: Sucursal) => {
    setSucursalAEliminar(sucursal);
    setMostrarModalConfirmacion(true);
    setShowNotification(false);
    setNotificationMessage('');
    setNotificationType('');
  };

  const confirmarEliminacion = async () => {
    if (!sucursalAEliminar) return;

    setEstaEliminando(true);
    setMostrarModalConfirmacion(false);

    try {
      const response = await fetch('http://localhost:8080/public/darDeBajaSucursal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idSucursal: sucursalAEliminar.idSucursal }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        setNotificationMessage(errorText || 'Error desconocido al dar de baja la sucursal.');
        setNotificationType('error');
        setShowNotification(true);
        return;
      }

      setNotificationMessage('¡La sucursal ha sido dada de baja exitosamente!');
      setNotificationType('success');
      setShowNotification(true);
      fetchSucursales();

    } catch (err: any) {
      setNotificationMessage(`Error de conexión: ${err.message || 'No se pudo conectar con el servidor.'}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setEstaEliminando(false);
      setSucursalAEliminar(null);

      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage('');
        setNotificationType('');
      }, 3000);
    }
  };

  const cancelarEliminacion = () => {
    setMostrarModalConfirmacion(false);
    setSucursalAEliminar(null);
    setShowNotification(false);
    setNotificationMessage('');
    setNotificationType('');
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Gestión de Sucursales</h1>
      <div className="flex justify-end mb-8">
        <Button
          onClick={handleAddSucursal}
          className="bg-amber-600 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 text-base">
          + Agregar Sucursal
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-700">
          <Loader2 className="animate-spin mr-2" size={24} /> Cargando sucursales...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">
          Error al cargar las sucursales: {error}. Por favor, inténtalo de nuevo más tarde.
        </div>
      ) : sucursales.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No hay sucursales para mostrar.</div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-white shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-400/70">
                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Id Sucursal</TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Localidad</TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Dirección</TableHead>
                <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sucursales.map((sucursal) => (
                <TableRow key={sucursal.idSucursal} className="border-b border-yellow-300 odd:bg-gray-50">
                  <TableCell className="px-4 py-3 font-medium text-gray-900 border-r border-yellow-200 ">{sucursal.idSucursal}</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-900 border-r border-yellow-200 ">{sucursal.localidad}</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-900 border-r border-yellow-200 ">{sucursal.direccion}</TableCell>
                  <TableCell className="px-2 py-2 text-center">
                    <Button
                      onClick={() => handleClickEliminar(sucursal)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-md shadow-lg transition-colors duration-200 text-sm"
                      disabled={estaEliminando}
                    >
                      Dar de Baja
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}


      {mostrarModalConfirmacion && sucursalAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4  bg-amber-950/40 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center border-gray-500 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas dar de baja la sucursal:
              <br />
              <span className="font-semibold text-gray-800">{sucursalAEliminar.localidad} - {sucursalAEliminar.direccion}</span>?
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
                {estaEliminando ? 'Dando de baja...' : 'Dar de Baja'}
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