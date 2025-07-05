"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";

export default function RegistroDevolucionPage() {
  const { idAlquiler } = useParams();
  const router = useRouter();

  const [alquiler, setAlquiler] = useState<any>(null);
  const [patente, setPatente] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrado, setRegistrado] = useState(false);
  const [error, setError] = useState("");

   const formatFecha = (fechaString: string) => {
    if (!fechaString) return "Fecha no disponible";
    const [año, mes, dia] = fechaString.split('-');
    return `${dia}/${mes}/${año}`;
  };

  const formatHora = (horaString: string) => {
    if (!horaString) return "Hora no disponible";
    const [hora, minutos] = horaString.split(':');
    return `${hora}:${minutos}`;
  };

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`http://localhost:8080/empleado/verAlquiler`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idAlquiler }),
        });

        if (!res.ok) throw new Error("Error al cargar los datos del alquiler");

        const data = await res.json();
        setAlquiler(data.alquiler);
        setPatente(data.patente || "Patente no disponible");
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchDetalle();
  }, [idAlquiler]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8080/empleado/registrarDevolucion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patente: patente,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Error al registrar la devolución");
      }

      setRegistrado(true);
      setTimeout(() => router.push("/dashboard-empleado/devoluciones"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-amber-700 leading-tight">
        Registrar Devolución
      </h1>

      {!alquiler ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md">
          <Loader2 className="animate-spin w-8 h-8 text-amber-600 mr-3" />
          <span className="text-lg text-gray-600">Cargando datos del alquiler...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Auto</Label>
              <div className="text-gray-800 text-lg mt-1 font-medium">
                {alquiler.reserva.auto.marca} {alquiler.reserva.auto.modelo}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Categoria</Label>
              <div className="text-gray-800 mt-1">
                {alquiler.reserva.auto.categoria}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Patente</Label>
              <div className="text-gray-800 mt-1">
                {patente}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Precio Total</Label>
              <div className="text-gray-700 text-xl font-bold mt-1">
                ${alquiler.precio}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Sucursal de Entrega</Label>
              <div className="text-gray-800 mt-1">
                {alquiler.reserva.sucursalEntrega.localidad} - {alquiler.reserva.sucursalEntrega.direccion}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Sucursal de Regreso</Label>
              <div className="text-gray-800 mt-1">
                {alquiler.reserva.sucursalRegreso.localidad} - {alquiler.reserva.sucursalRegreso.direccion}
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200 my-3" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Fecha y Hora de Entrega</Label>
              <div className="text-gray-800 mt-1">
                {formatFecha(alquiler.reserva.fechaEntrega)} - {formatHora(alquiler.reserva.horaEntrega)}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Fecha y Hora de Regreso</Label>
              <div className="text-gray-800 mt-1">
                {formatFecha(alquiler.reserva.fechaRegreso)} - {formatHora(alquiler.reserva.horaRegreso)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">Paquetes Extras</Label>
            {alquiler.paquetesExtras.length === 0 ? (
              <div className="text-gray-500 text-sm italic">No hay paquetes extras adicionales.</div>
            ) : (
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {alquiler.paquetesExtras.map((paquete: any) => (
                  <li key={paquete.idPaquete} className="text-sm">
                    <span className="font-medium">{paquete.tipoPaquete}</span> 
                  </li>
                ))}
              </ul>
            )}
          </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm" role="alert">
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg text-lg transition-colors duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-3" /> Procesando Devolución...
              </>
            ) : (
              "Confirmar Devolución"
            )}
          </Button>
        </form>
      )}


      {registrado && (
       <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg text-green-700">¡Devolución registrada con éxito!</h3>
              <p className="text-sm text-gray-600">Redirigiendo al listado de devoluciones...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}