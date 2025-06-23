"use client";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { es } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// MODIFICACIÓN CLAVE: AutoInfoDTO DEBE REFLEJAR EXACTAMENTE TU AutoDTO (Java Record)
// Basado en el JSON proporcionado, el AutoDTO tiene estas propiedades directamente.
interface AutoInfoDTO {
  idAuto: number; // Por ejemplo: 30
  idCategoria: number; // Por ejemplo: 7
  marca: string; // Por ejemplo: "Toyota"
  modelo: string; // Por ejemplo: "Hilux"
  precio: number; // Por ejemplo: 5000.0
  cantidadAsientos: number; // Por ejemplo: 5
  categoria: string; // Por ejemplo: "PickUp AT"
  idPoliticaCancelacion: number; // Por ejemplo: 3
  porcentaje: number; // Por ejemplo: 0.0
}

// AutoAlquiladoBackendDTO es CORRECTA según tu definición de Java y el JSON esperado
// Contiene un AutoInfoDTO anidado bajo la clave 'auto' y una 'cantida'
interface AutoAlquiladoBackendDTO {
  auto: AutoInfoDTO; // La propiedad 'auto' existe y contiene un AutoInfoDTO
  cantida: number;   // La propiedad 'cantida' también existe (esta es la que se suma)
}

interface FechasRequestDTO {
  fechaInicio: string;
  fechaFin: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300'];

export default function EstadisticasPage() {
  const [fechaInicioInput, setFechaInicioInput] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [fechaFinInput, setFechaFinInput] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const [currentAutoRentals, setCurrentAutoRentals] = useState<AutoAlquiladoBackendDTO[]>([]);
  const [appliedFechaInicio, setAppliedFechaInicio] = useState<string | null>(null);
  const [appliedFechaFin, setAppliedFechaFin] = useState<string | null>(null);

  const [hasSearched, setHasSearched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });

  // Accede a autoAlquilado.auto.marca y autoAlquilado.auto.modelo (estructura anidada correcta)
  const brandModelChartData = useMemo(() => {
    const brandModelCounts: { [key: string]: number } = {};
    currentAutoRentals.forEach(autoAlquilado => {
      // Defensa para asegurar que 'auto' existe antes de acceder a sus propiedades
      if (autoAlquilado.auto) {
        const brandModel = `${autoAlquilado.auto.marca} - ${autoAlquilado.auto.modelo}`;
        brandModelCounts[brandModel] = (brandModelCounts[brandModel] || 0) + autoAlquilado.cantida;
      }
    });

    return Object.entries(brandModelCounts).map(([marcaModelo, conteo]) => ({
      marcaModelo,
      conteo,
    }));
  }, [currentAutoRentals]);

  // Accede a autoAlquilado.auto.categoria (estructura anidada correcta)
  const categoryChartData = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    currentAutoRentals.forEach(autoAlquilado => {
      // Defensa para asegurar que 'auto' existe antes de acceder a sus propiedades
      if (autoAlquilado.auto) {
        const category = autoAlquilado.auto.categoria;
        categoryCounts[category] = (categoryCounts[category] || 0) + autoAlquilado.cantida;
      }
    });

    return Object.entries(categoryCounts).map(([categoryName, count]) => ({
      name: categoryName,
      value: count,
    }));
  }, [currentAutoRentals]);

  const totalAlquileres = useMemo(() => {
    return currentAutoRentals.reduce((sum, item) => sum + item.cantida, 0);
  }, [currentAutoRentals]);


  const fetchEstadisticas = async () => {
    if (!fechaInicioInput || !fechaFinInput) {
      setFeedback({ message: "Por favor, selecciona un rango de fechas.", type: "error" });
      return;
    }

    const start = parseISO(fechaInicioInput);
    const end = parseISO(fechaFinInput);
    const today = new Date();

    if (isAfter(end, today)) {
      setFeedback({ message: "La fecha de fin no puede ser posterior a la fecha actual.", type: "error" });
      return;
    }
    if (isAfter(start, today)) {
      setFeedback({ message: "La fecha de inicio no puede ser posterior a la fecha actual.", type: "error" });
      return;
    }
    if (isAfter(start, end)) {
      setFeedback({ message: "La fecha de inicio no puede ser posterior a la fecha de fin.", type: "error" });
      return;
    }

    setLoading(true);
    setFeedback({ message: "Cargando estadísticas...", type: "success" });

    try {
      const requestBody: FechasRequestDTO = {
        fechaInicio: fechaInicioInput,
        fechaFin: fechaFinInput,
      };

      const res = await fetch("http://localhost:8080/empleado/verAutosAlquiladosEntreFechas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      setHasSearched(true);
      setAppliedFechaInicio(fechaInicioInput);
      setAppliedFechaFin(fechaFinInput);

      if (res.status === 204) {
        setCurrentAutoRentals([]);
        setFeedback({ message: "No se encontraron alquileres en el rango de fechas seleccionado.", type: "success" });
        return;
      }

      let data: AutoAlquiladoBackendDTO[] | { message?: string } | string;

      if (res.ok) {
        data = await res.json();
      } else {
        const errorText = await res.text();
        try {
          const jsonError = JSON.parse(errorText);
          data = jsonError;
        } catch (e) {
          data = errorText;
        }
      }

      if (!res.ok) {
        let errorMessage = "Error desconocido del servidor.";
        if (typeof data === 'string') {
          errorMessage = `Respuesta del servidor: ${data.substring(0, 200)}...`;
        } else if (data && typeof data === 'object' && 'message' in data) {
          errorMessage = data.message || errorMessage;
        } else if (data) {
          errorMessage = JSON.stringify(data);
        }
        throw new Error(`Fallo en la respuesta del servidor: ${errorMessage}`);
      }

      if (!Array.isArray(data)) {
         throw new Error("El formato de los datos recibidos del servidor no es un array.");
      }
      setCurrentAutoRentals(data as AutoAlquiladoBackendDTO[]);

      if (data.length === 0) {
        setFeedback({ message: "No se encontraron alquileres en el rango de fechas seleccionado.", type: "success" });
      } else {
        setFeedback({ message: "Estadísticas cargadas con éxito.", type: "success" });
      }
    } catch (err) {
      let userMessage = "Ha ocurrido un error inesperado al cargar las estadísticas.";
      if (err instanceof Error) {
        userMessage = err.message;
      }
      setFeedback({
        message: userMessage,
        type: "error",
      });
      setCurrentAutoRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(parseISO(dateString), "dd 'de' LLLL 'de'yyyy", { locale: es });
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Estadísticas de <span className="text-amber-600">Alquileres</span>
      </h1>

      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-700 space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
            <input
              id="fechaInicio"
              type="date"
              value={fechaInicioInput}
              onChange={(e) => setFechaInicioInput(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>
          <div>
            <Label htmlFor="fechaFin">Fecha de Fin</Label>
            <input
              id="fechaFin"
              type="date"
              value={fechaFinInput}
              onChange={(e) => setFechaFinInput(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>
        </div>

        <Button
          onClick={fetchEstadisticas}
          disabled={loading || !fechaInicioInput || !fechaFinInput}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Cargando..." : "Generar Estadísticas"}
        </Button>

        {feedback.message && (
          <div
            className={`mt-4 p-3 rounded break-words text-sm ${
              feedback.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {hasSearched && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700">
            <h2 className="text-2xl font-bold text-center mb-2">
              Resultados de Alquileres
            </h2>
            {appliedFechaInicio && appliedFechaFin && (
              <p className="text-center text-gray-600 text-lg mb-6">
                Período: Desde el {formatDateForDisplay(appliedFechaInicio)} hasta el {formatDateForDisplay(appliedFechaFin)}
              </p>
            )}

            <div className="bg-amber-50 p-6 rounded-lg text-center border border-amber-100">
              <p className="text-gray-700 text-xl font-semibold">Total de Autos Alquilados en este período:</p>
              <p className="text-amber-700 text-4xl font-extrabold mt-2">{totalAlquileres}</p>
            </div>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700">
            <h3 className="text-xl font-bold text-center mb-4">
              Alquileres por Marca y Modelo de Auto
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={brandModelChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="marcaModelo"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickFormatter={(tick) => Math.floor(tick).toString()}
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conteo" fill="#FFBF00" name="Número de Alquileres" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {categoryChartData.length > 0 ? (
            <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700">
              <h3 className="text-xl font-bold text-center mb-4">
                Categorías de Autos Alquilados
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      innerRadius={60}
                      paddingAngle={5}
                      // fill={COLORS} // Esta línea ha sido eliminada para evitar el error 'Type 'string[]' is not assignable to type 'string'.'
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {
                        categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} alquileres`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-lg shadow-xl border border-amber-700 flex items-center justify-center h-[400px] text-gray-500 text-lg text-center">
              No hay datos de categorías para mostrar en este período.
            </div>
          )}

        </div>
      )}
    </div>
  );
}