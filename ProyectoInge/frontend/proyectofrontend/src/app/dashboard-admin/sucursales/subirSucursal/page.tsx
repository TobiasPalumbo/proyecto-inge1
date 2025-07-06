"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function SubirSucursalForm() {
  const [localidad, setLocalidad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const [loading, setLoading] = useState(false);
  const [sucursalSubida, setSucursalSubida] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!localidad || !direccion) {
      setFeedback({ message: "Completá todos los campos.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ message: "", type: "" }); 

      const res = await fetch("http://localhost:8080/admin/subirSucursal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localidad, direccion }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al subir nueva sucursal");
      }

      setFeedback({ message: "Sucursal creada con éxito.", type: "success" });
      setSucursalSubida(true);

      setTimeout(() => {
        router.push("/dashboard-admin/sucursales");
      }, 2000);
    } catch (err) {
      setFeedback({
        message: `Error: ${(err as Error).message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Subir Nueva <span className="text-amber-600">Sucursal</span>
      </h1>
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-500 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
              Selecciona una imagen para la sucursal
            </Label>
            <input required  type="file" accept="image/*"  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border" />
            <Label htmlFor="localidad" className="block text-sm font-medium text-gray-700">
              Localidad
            </Label>
            <input
              id="localidad"
              value={localidad}
              onChange={(e) => {
                setLocalidad(e.target.value);
                if (feedback.type === "error") { 
                  setFeedback({ message: "", type: "" });
                }
              }}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
          <div>
            <Label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              Dirección
            </Label>
            <input
              id="direccion"
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
                if (feedback.type === "error") {
                  setFeedback({ message: "", type: "" });
                }
              }}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
        </div>

        {feedback.message && (
          <div
            className={`mt-4 p-3 rounded break-words text-sm w-full ${
              feedback.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white text-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Subiendo sucursal..." : "Subir sucursal"}
        </Button>
      </form>

      {sucursalSubida && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg text-green-700">
                ¡Sucursal subida!
              </h3>
              <p className="text-sm text-gray-600">
                Redirigiendo a la lista de sucursales...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}