"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react"; // Importar Loader2 para el estado de carga

// --- INTERFACES BASADAS EN TU BACKEND ---

interface PaqueteExtra {
  idPaquete: number;
  tipoPaquete: string;
  precio: number;
  cantidad: number;
}

interface AutoDTO {
  idAuto: number;
  idCategoria: number;
  marca: string;
  modelo: string;
  precioDia: number;
  cantidadAsientos: number;
  descripcionCategoria: string;
  idPoliticaCancelacion: number;
  porcentajeCancelacion: number;
}

interface Sucursal {
  localidad: string;
  direccion: string;
}

interface ReservaDTO {
  idReserva: number;
  sucursalEntrega: Sucursal;
  sucursalRegreso: Sucursal;
  auto: AutoDTO;
  estado: string;
  fechaEntrega: string; 
  fechaRegreso: string; 
  horaEntrega: string; 
  horaRegreso: string; 
}

interface AlquilerDTO {
  idAlquiler: number;
  precio: number;
  reserva: ReservaDTO;
  paquetesExtras: PaqueteExtra[];
}


export default function MisAlquileres() {
  const router = useRouter();
  const [alquileres, setAlquileres] = useState<AlquilerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlquileres = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/misAlquileres", {
          credentials: "include",
        });

        if (response.status === 204) {
          setAlquileres([]);
        } else if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error al cargar alquileres: ${errorText || response.statusText}`
          );
        } else {
          const data: AlquilerDTO[] = await response.json();
          setAlquileres(data);
        }
      } catch (err: any) {
        console.error("Error fetching alquileres:", err);
        setError(`No se pudieron cargar tus alquileres: ${err.message}`);
        setAlquileres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlquileres();
  }, []);

  function formatDateTime(dateString: string, timeString: string): string {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  function formatPaquetesExtras(paquetes: PaqueteExtra[]): string {
    if (!paquetes || paquetes.length === 0) {
      return "Ninguno";
    }
    return paquetes
      .map((p) => `${p.tipoPaquete}`)
      .join(", ");
  }

  return (
    <>
      <Button
        className="fixed top-4 left-4 z-50 px-6 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition duration-200 shadow-lg"
        onClick={() => router.push("/miperfil")}
      >
        ← Volver
      </Button>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Mis Alquileres</h1>

        <div className="overflow-x-auto rounded-lg border border-yellow-300 shadow-md w-full max-w-7xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-400/70">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  ID Alquiler
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Auto
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Categoría
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Paquetes Extra
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Precio Total Alquiler
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Fecha/Hora Entrega
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Fecha/Hora Regreso
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Sucursal Entrega
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Sucursal Regreso
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white divide-y divide-yellow-200">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={9} // Ajusta el colSpan según el número de columnas
                    className="text-center py-10 text-gray-500 text-lg"
                  >
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin mr-2" size={24} /> Cargando alquileres...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-red-600 text-lg">
                    {error}
                  </TableCell>
                </TableRow>
              ) : alquileres.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9} // Ajusta el colSpan
                    className="text-center py-10 text-gray-500 text-lg"
                  >
                    No tenés alquileres para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                alquileres.map((alquiler) => (
                  <TableRow key={alquiler.idAlquiler}>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {alquiler.idAlquiler}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {alquiler.reserva.auto.marca}{" "}
                      {alquiler.reserva.auto.modelo}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {alquiler.reserva.auto.descripcionCategoria}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {formatPaquetesExtras(alquiler.paquetesExtras)}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      ${alquiler.precio.toFixed(0)}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {formatDateTime(alquiler.reserva.fechaEntrega, alquiler.reserva.horaEntrega)}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {formatDateTime(alquiler.reserva.fechaRegreso, alquiler.reserva.horaRegreso)}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-yellow-300">
                      {alquiler.reserva.sucursalEntrega.localidad},{" "}
                      {alquiler.reserva.sucursalEntrega.direccion}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {alquiler.reserva.sucursalRegreso.localidad},{" "}
                      {alquiler.reserva.sucursalRegreso.direccion}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}