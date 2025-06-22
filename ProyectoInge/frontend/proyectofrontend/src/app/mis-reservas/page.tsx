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

interface Auto {
  marca: string;
  modelo: string;
  categoria: string;
  precio: number;
  porcentaje: number;
}
interface Sucursal {
  localidad: string;
  direccion: string;
}

interface Reserva {
  idReserva: number;
  auto: Auto;
  fechaEntrega: string;
  fechaRegreso: string;
  precio: number;
  estado: string;
  sucursalEntrega: Sucursal;
  sucursalRegreso: Sucursal;
}

export default function MisReservas() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/misReservas", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 204) return [];
        if (!res.ok) throw new Error("Error al cargar reservas");
        return res.json();
      })
      .then((data) => setReservas(data))
      .catch((err) => {
        console.error(err);
        setReservas([]);
      })
      .finally(() => setLoading(false));
  }, []);



  return (
    <>
      <Button
        className="fixed top-4 left-4 z-50 px-6 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition duration-200 shadow-lg"
        onClick={() => router.push("/miperfil")}
      >
        ← Volver
      </Button>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>

        <Button
          onClick={() => router.push("/cancelar-reserva")}
          className="bg-amber-800 hover:bg-amber-900 text-white shadow-md mb-8"
        >
          Cancelar una Reserva
        </Button>

        <div className="overflow-x-auto rounded-lg border border-yellow-300 shadow-md w-full max-w-7xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-400/70">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  ID Reserva
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Auto
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Categoría
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Precio Total
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Política de Cancelación
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Entrega
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Regreso
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Sucursal Entrega
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-amber-950 uppercase tracking-wider border-r border-yellow-500">
                  Sucursal Regreso
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Estado
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white divide-y divide-yellow-200">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-gray-500 text-lg"
                  >
                    Cargando reservas...
                  </TableCell>
                </TableRow>
              ) : reservas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-gray-500 text-lg"
                  >
                    No tenés reservas.
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map(
                  (reserva) => (
                    console.log(
                      reserva.auto.precio,
                      reserva.auto.porcentaje,
                    ),
                    (
                      <TableRow key={reserva.idReserva}>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {reserva.idReserva}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {reserva.auto.marca} {reserva.auto.modelo}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {reserva.auto.categoria}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          $
                          {reserva.precio}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {(reserva.auto.porcentaje *100).toFixed(0)}%
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {new Date(reserva.fechaEntrega).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {new Date(reserva.fechaRegreso).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {reserva.sucursalEntrega.localidad},{" "}
                          {reserva.sucursalEntrega.direccion}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-r border-yellow-300">
                          {reserva.sucursalRegreso.localidad},{" "}
                          {reserva.sucursalRegreso.direccion}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          {reserva.estado}
                        </TableCell>
                      </TableRow>
                    )
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
