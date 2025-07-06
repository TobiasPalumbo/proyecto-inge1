"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  parseISO,
  isValid,
  startOfWeek,
  addDays,
} from "date-fns";
import { es } from "date-fns/locale";

interface GananciaDiariaDTO {
  dia: string; // Esperamos que 'dia' sea un string en formato ISO como 'YYYY-MM-DD'
  ganancia: number;
}

interface GananciaSemanalDTO {
  semana: number;
  mes: number;
  anio: number;
  gananciaTotal: number;
  gananciasDiaras: GananciaDiariaDTO[];
}

interface DailyProfitsChartProps {
  data: GananciaDiariaDTO[];
  selectedWeekDate: string; // La fecha seleccionada por el usuario para determinar la semana
}

function DailyProfitsChart({ data, selectedWeekDate }: DailyProfitsChartProps) {
  if (!data) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar.</p>
    );
  }

  const baseDate = parseISO(selectedWeekDate);
  if (!isValid(baseDate)) {
    return (
      <p className="text-center text-red-500">Fecha base inválida para el gráfico.</p>
    );
  }

  const weekStart = startOfWeek(baseDate, { locale: es, weekStartsOn: 1 });

  const weekDataMap = new Map<string, number>();
  data.forEach((item) => {
    const dateKey = parseISO(item.dia).toISOString().split('T')[0];
    weekDataMap.set(dateKey, item.ganancia);
  });

  const fullWeekData: any[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);
    const dateKey = currentDay.toISOString().split('T')[0];
    
    fullWeekData.push({
      name: format(currentDay, "EEE", { locale: es }),
      ganancia: weekDataMap.has(dateKey) ? weekDataMap.get(dateKey) : 0,
      fullDateTooltip: format(currentDay, "EEEE dd/MM", { locale: es }),
    });
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={fullWeekData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number | string) =>
            typeof value === "number" ? `$${value.toFixed(2)}` : value
          }
          labelFormatter={(label: string, payload: any[]) => {
            if (payload && payload.length > 0) {
              return payload[0].payload.fullDateTooltip;
            }
            return label;
          }}
        />
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
    <Card className="max-w-sm mx-auto flex flex-col justify-center items-center text-center p-4 border border-gray-200 shadow-md">
      <CardHeader className="pb-2 pt-2 w-full flex flex-col items-center">
        <div className="text-2xl font-bold text-gray-900 leading-tight mb-1">
          <p>Ganancia Total</p>
          <p>Semanal</p>
        </div>
        <CardDescription className="text-sm text-gray-500">
          Semana {semanaInfo.semana}/{semanaInfo.mes}/{semanaInfo.anio}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-2 w-full flex justify-center">
        <p className="text-5xl font-extrabold text-green-600">
          ${totalGanancia.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}

export default function GananciasSemanalasPage() {
  const [selectedDateString, setSelectedDateString] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [gananciasData, setGananciasData] = useState<GananciaSemanalDTO | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({
    message: "",
    type: "",
  });

  const handleFetchGanancias = useCallback(async () => {
    if (!selectedDateString) {
      setFeedback({
        message: "Se requiere una fecha para generar estadísticas.",
        type: "error",
      });
      setGananciasData(null);
      return;
    }

    setLoading(true);
    setGananciasData(null);
    setFeedback({ message: "Cargando estadísticas...", type: "" });

    try {
      const response = await fetch(
        "http://localhost:8080/admin/verGananciasSemanales",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ dia: selectedDateString }),
        }
      );

      if (!response.ok) {
        let errorMessageFromBackend = "";
        let errorText = await response.text();

        try {
          const jsonError = JSON.parse(errorText);
          errorMessageFromBackend = jsonError.message || errorText;
        } catch (e) {
          errorMessageFromBackend =
            errorText || `No se encontraron resultados.`;
        }

        const finalErrorMessage =
          errorMessageFromBackend || `No se encontraron resultados.`;
        setFeedback({ message: finalErrorMessage, type: "error" });
        return;
      }
      const data: GananciaSemanalDTO = await response.json();
      setGananciasData(data);
      console.log(data)
      if (
        data.gananciaTotal === 0 &&
        (data.gananciasDiaras === null || data.gananciasDiaras.length === 0)
      ) {
        setFeedback({
          message: "No se encontraron ganancias para la semana seleccionada.",
          type: "success",
        });
      } else {
        setFeedback({
          message: "Estadísticas de ganancias cargadas con éxito.",
          type: "success",
        });
      }
    } catch (err: unknown) {
      let errorMessage = "Error inesperado al conectar con el servidor.";
      if (err instanceof Error) {
        errorMessage += ` Detalles: ${err.message}`;
      } else if (typeof err === "string") {
        errorMessage += ` Detalles: ${err}`;
      }
      setGananciasData(null);
      setFeedback({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedDateString]);

  useEffect(() => {}, [selectedDateString]);

  const hasActualData =
    gananciasData &&
    (gananciasData.gananciaTotal > 0 ||
      (gananciasData.gananciasDiaras &&
        gananciasData.gananciasDiaras.length > 0));

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Estadísticas de{" "}
        <span className="text-amber-600">Ganancias Semanales</span>
      </h1>

      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-700 space-y-6 mb-8">
        <label
          htmlFor="date-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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

        {feedback.message && (
          <div
            className={`mt-4 p-3 rounded break-words text-sm ${
              feedback.type === "error"
                ? "bg-red-100 text-red-800"
                : feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-8 mt-8">
          <Skeleton className="w-[300px] h-[150px]" />
          <Skeleton className="w-full max-w-5xl h-[400px]" />
        </div>
      )}

      {hasActualData && !loading && (
        // Esta es la línea que debemos cambiar para aumentar la separación
        <div className="flex flex-col items-center gap-8 mt-8"> 
          <WeeklyTotalCard
            totalGanancia={gananciasData.gananciaTotal}
            semanaInfo={{
              semana: gananciasData.semana,
              mes: gananciasData.mes,
              anio: gananciasData.anio,
            }}
          />
          <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700 w-full max-w-4xl">
            <h3 className="text-xl font-bold text-center mb-5">
              Ganancias Diarias de la Semana
            </h3>
            <DailyProfitsChart
              data={gananciasData.gananciasDiaras}
              selectedWeekDate={selectedDateString}
            />
          </div>
        </div>
      )}
    </div>
  );
}