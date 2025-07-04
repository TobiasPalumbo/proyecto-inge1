"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Aunque no se usa directamente, se mantiene si es un componente de UI de tu librería
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { isAfter, format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react"; // Importar Loader2 para el spinner

// Tipos
type ClienteDTO = {
  dni: string;
  telefono: string;
  nombre: string;
  apellido: string;
  correo: string;
  fechaRegistro: string;
  fechaNac: string;
};

type RegistroPorDia = {
  fecha: string;
  cantidad: number;
};

// Ticks personalizados
const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
        fontSize={10}
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function EstadisticasClientes() {
  // Inicializamos con la fecha actual formateada correctamente
  const [fechaInicio, setFechaInicio] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fechaFin, setFechaFin] = useState(format(new Date(), "yyyy-MM-dd"));

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [datosPorDia, setDatosPorDia] = useState<RegistroPorDia[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Bandera para controlar si ya se ha intentado una búsqueda y si hay resultados válidos para mostrar
  // Esta bandera ahora indica que hay datos para mostrar, no que se intentó la búsqueda.
  const [hasData, setHasData] = useState(false);

  // Eliminamos el useEffect que limpiaba al cambiar las fechas.
  // Ahora, la limpieza ocurre solo al iniciar una nueva búsqueda en obtenerEstadisticas.

  const agruparPorFecha = (clientes: ClienteDTO[]) => {
    const conteo: Record<string, number> = {};
    clientes.forEach((c: ClienteDTO) => {
      // Asegurarse de que fechaRegistro sea una cadena válida antes de usarla como clave
      const fecha = c.fechaRegistro || 'Sin Fecha'; // Fallback por si la fecha no existe
      conteo[fecha] = (conteo[fecha] || 0) + 1;
    });
    const datos: RegistroPorDia[] = Object.entries(conteo).map(
      ([fecha, cantidad]) => ({
        fecha,
        cantidad: Number(cantidad),
      })
    );
    // Ordenar los datos por fecha para el gráfico
    datos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    setDatosPorDia(datos);
  };

  // Función de validación de fechas (sin side-effects, solo retorna boolean)
  const validarFechas = useCallback(() => {
    // Si alguna fecha está vacía, no es válida para la operación
    if (!fechaInicio || !fechaFin) {
      setMensaje("Por favor, selecciona un rango de fechas.");
      return false;
    }

    const hoy = new Date();
    const inicio = parseISO(fechaInicio);
    const fin = parseISO(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        setMensaje("Formato de fecha inválido. Por favor, selecciona fechas válidas.");
        return false;
    }
    
    if (isAfter(inicio, fin)) {
      setMensaje("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return false;
    }
    if (isAfter(inicio, hoy) || isAfter(fin, hoy)) {
      setMensaje("Las fechas no pueden ser futuras.");
      return false;
    }
    return true; // Si todo es válido
  }, [fechaInicio, fechaFin]);

  const obtenerEstadisticas = useCallback(async () => {
    setMensaje(null); 
    setClientes([]);
    setDatosPorDia([]);
    setHasData(false);

    if (!validarFechas()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/admin/clientesRegistrados",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fechaInicio, fechaFin }),
        }
      );

      if (response.ok) {
        const data: ClienteDTO[] = await response.json();
        setClientes(data);
        agruparPorFecha(data);
        if (data.length === 0) {
          setMensaje("No se encontraron registros para el rango seleccionado.");
          setHasData(false);
        } else {
          setMensaje("Estadísticas generadas correctamente.");
          setHasData(true);
        }
      } else {
        const texto = await response.text();
        setMensaje(texto || "Error al obtener los datos del servidor.");
        setHasData(false);
      }
    } catch (err) {
      console.error("Error en obtenerEstadisticas:", err);
      setMensaje("Error de red o servidor al intentar obtener estadísticas.");
      setHasData(false); 
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, validarFechas]);
 useEffect(() => {
     if (!mensaje && !hasData) {
      obtenerEstadisticas();
    }
  }, [obtenerEstadisticas]); 

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Estadísticas de{" "}
        <span className="text-amber-600">Clientes Registrados</span>
      </h1>

      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-700 space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
          <div>
            <Label htmlFor="fechaFin">Fecha de Fin</Label>
            <input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
        </div>

        <Button
          onClick={obtenerEstadisticas}
          disabled={loading || !fechaInicio || !fechaFin}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white text-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Cargando..." : "Generar Estadísticas"}
        </Button>

        {mensaje && (
          <div
            className={`mt-4 p-3 rounded text-sm ${
              mensaje.includes("Error") ||
              mensaje.includes("inválido") ||
              mensaje.includes("futuras") ||
              mensaje.includes("posterior a") ||
              mensaje.includes("No se encontraron registros")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {mensaje}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-8 mt-8">
          <Skeleton className="w-[300px] h-[150px]" />
          <Skeleton className="w-full max-w-5xl h-[400px]" />
        </div>
      )}
{!loading && hasData && datosPorDia.length > 0 && (
        <div className="flex flex-col items-center gap-8 mt-8">
          <Card className="w-full max-w-4xl border border-amber-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center mb-2">
                Registros por Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={datosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tick={<CustomizedAxisTick />}
                    height={60}
                    interval={0}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cantidad"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="w-full max-w-6xl border border-amber-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                Detalle de Clientes Registrados
              </CardTitle>
              <CardDescription className="text-center">
                Total: {clientes.length} clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente, index) => (
                    <TableRow key={index}>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.apellido}</TableCell>
                      <TableCell>{cliente.correo}</TableCell>
                      <TableCell>{cliente.fechaRegistro}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
     {!loading && !hasData && mensaje && 
        !(mensaje.includes("Error") || mensaje.includes("inválido") || mensaje.includes("futuras") || mensaje.includes("posterior a")) && (
        <div className="mt-8 text-center text-gray-600 text-lg">
          {mensaje}
        </div>
      )}
    </div>
  );
}