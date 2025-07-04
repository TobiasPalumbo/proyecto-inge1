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

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`http://localhost:8080/empleado/verDetalleAlquiler/${idAlquiler}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar los datos del alquiler");
        const data = await res.json();
        setAlquiler(data);
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
          idAlquiler: Number(idAlquiler),
          patente: patente.trim().toUpperCase(),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      setRegistrado(true);
      setTimeout(() => router.push("/dashboard-admin/devoluciones"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-amber-600">
        Registrar Devolución
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {!alquiler ? (
        <div className="text-center text-gray-500 py-10">Cargando datos del alquiler...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-lg shadow space-y-6">
          <div>
            <Label className="text-sm font-medium">Auto</Label>
            <div className="text-gray-800 mt-1">
              {alquiler.reserva.auto.marca} {alquiler.reserva.auto.modelo} -{" "}
              {alquiler.reserva.auto.categoria}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Sucursal Regreso</Label>
            <div className="text-gray-800 mt-1">
              {alquiler.reserva.sucursalRegreso.localidad} -{" "}
              {alquiler.reserva.sucursalRegreso.direccion}
            </div>
          </div>

          <div>
            <Label htmlFor="patente" className="text-sm font-medium">
              Patente del Auto
            </Label>
            <input
              id="patente"
              type="text"
              value={patente}
              onChange={(e) => setPatente(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm"
              placeholder="Ej: ABC123 o AE123FG"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 text-white text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Registrando...
              </>
            ) : (
              "Registrar Devolución"
            )}
          </Button>
        </form>
      )}

      {registrado && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="text-green-500 w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">
                ¡Devolución registrada con éxito!
              </h3>
              <p className="text-sm text-gray-600">Redirigiendo...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
