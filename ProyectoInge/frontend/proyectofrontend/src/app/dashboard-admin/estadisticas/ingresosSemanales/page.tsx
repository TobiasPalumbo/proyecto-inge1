"use client"

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


interface GananciaDiariaDTO {
  dia: string;
  ganancia: number;
}

interface GananciaSemanalDTO {
  semana: number;
  mes: number;
  anio: number;
  total: number;
  gananciasDiariasDTO: GananciaDiariaDTO[];
}

interface DailyProfitsChartProps {
  data: GananciaDiariaDTO[];
}

function DailyProfitsChart({ data }: DailyProfitsChartProps) {
  const chartData = data.map((item: GananciaDiariaDTO) => ({
    name: format(new Date(item.dia), 'EEE', { locale: es }),
    ganancia: item.ganancia,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number | string) => {
          if (typeof value === 'number') {
            return `$${value.toFixed(2)}`;
          }
          return value;
        }} />
        <Bar dataKey="ganancia" fill="#FFBF00" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface SemanaInfo {
  semana: number;
  mes: number;
  anio: number;
}

interface WeeklyTotalCardProps {
  totalGanancia: number;
  semanaInfo: SemanaInfo;
}

function WeeklyTotalCard({ totalGanancia, semanaInfo }: WeeklyTotalCardProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Ganancia Total Semanal</CardTitle>
        <CardDescription>Semana {semanaInfo.semana}, {semanaInfo.mes}/{semanaInfo.anio}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">${totalGanancia.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}

export default function GananciasSemanalasPage() {
  const [selectedDateString, setSelectedDateString] = useState<string>(new Date().toISOString().split('T')[0]);
  const [gananciasData, setGananciasData] = useState<GananciaSemanalDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: ""
  });


  const handleFetchGanancias = useCallback(async () => {
    if (!selectedDateString) {
      setFeedback({ message: "Se requiere una fecha para generar estadísticas.", type: "error" });
      setGananciasData(null);
      return;
    }

    setLoading(true);
    setGananciasData(null);
    setFeedback({ message: "Cargando estadísticas...", type: "" });

    try {
      const response = await fetch('http://localhost:8080/empleado/verGananciasSemanalas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dia: selectedDateString }),
      });

      if (!response.ok) {
        let errorMessageFromBackend = '';
        let errorText = await response.text();

        try {
          const jsonError = JSON.parse(errorText);
          errorMessageFromBackend = jsonError.message || errorText; // Usar 'message' si existe, si no el texto completo
        } catch (e) {
          errorMessageFromBackend = errorText || `No se encontraron resultados.`;
        }

        const finalErrorMessage = errorMessageFromBackend || `No se encontraron resultados.`;
        setFeedback({ message: finalErrorMessage, type: "error" });
        return;
      }

      const data: GananciaSemanalDTO = await response.json();
      setGananciasData(data);

      if (data.total === 0 && (data.gananciasDiariasDTO === null || data.gananciasDiariasDTO.length === 0)) {
        setFeedback({ message: "No se encontraron ganancias para la semana seleccionada.", type: "success" });
      } else {
        setFeedback({ message: "Estadísticas de ganancias cargadas con éxito.", type: "success" });
      }

    } catch (err: unknown) {
      // Este catch es para errores que impidan que la solicitud se complete (ej. servidor no disponible, error de red)
      let errorMessage = 'Error inesperado al conectar con el servidor.';
      if (err instanceof Error) {
        errorMessage += ` Detalles: ${err.message}`;
      } else if (typeof err === 'string') {
        errorMessage += ` Detalles: ${err}`;
      }
      setGananciasData(null);
      setFeedback({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedDateString]);

  useEffect(() => {
    // Sin fetch inicial al montar. El usuario debe usar el botón.
  }, []);

  const hasActualData = gananciasData && (gananciasData.total > 0 || (gananciasData.gananciasDiariasDTO && gananciasData.gananciasDiariasDTO.length > 0));

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Estadísticas de <span className="text-amber-600">Ganancias Semanales</span>
      </h1>

      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-700 space-y-6 mb-8">
        <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona una fecha:
        </label>
        <input
          type="date"
          id="date-input"
          value={selectedDateString}
          onChange={(e) => setSelectedDateString(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
          max={format(new Date(), "yyyy-MM-dd")}
        />

        <Button
          onClick={handleFetchGanancias}
          disabled={loading || !selectedDateString}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white text-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Cargando..." : "Generar Estadísticas"}
        </Button>

        {/* feedback: ÚNICO LUGAR para mensajes de operación (éxito/error del fetch) */}
        {feedback.message && (
          <div
            className={`mt-4 p-3 rounded break-words text-sm ${
              feedback.type === "error"
                ? "bg-red-100 text-red-800"
                : feedback.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700" // Estilo para mensajes de carga o informativos neutrales
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Skeleton className="w-full h-[150px]" />
            <Skeleton className="w-full h-[300px]" />
        </div>
      )}

      {/* Condición para mostrar los gráficos si hay datos y no está cargando.
          Si no hay datos (hasActualData es false), NO se muestra nada abajo.
      */}
      {hasActualData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700 flex flex-col justify-center items-center">
            <WeeklyTotalCard
              totalGanancia={gananciasData.total}
              semanaInfo={{
                semana: gananciasData.semana,
                mes: gananciasData.mes,
                anio: gananciasData.anio
              }}
            />
          </div>

          <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700">
            <h3 className="text-xl font-bold text-center mb-4">
              Ganancias Diarias de la Semana
            </h3>
            <DailyProfitsChart data={gananciasData.gananciasDiariasDTO} />
          </div>
        </div>
      )}
    </div>
  );
}