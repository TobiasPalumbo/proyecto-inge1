"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface Sucursal {
  idSucursal: number;
  localidad: string;
  direccion: string;
}

export default function SubirEmpleadoForm() {
  const router = useRouter();

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const [empleadoSubido, setEmpleadoSubido] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cuil, setCuil] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [idSucursal, setIdSucursal] = useState<number | "">("");

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  useEffect(() => {
    fetch("http://localhost:8080/public/sucursales")
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => {
        console.error("Error al cargar sucursales:", err);
        setFeedback({
          message: "No se pudieron cargar las sucursales.",
          type: "error",
        });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nombre ||
      !apellido ||
      !cuil ||
      !correo ||
      !contraseña ||
      !idSucursal
    ) {
      setFeedback({ message: "Completá todos los campos.", type: "error" });
      return;
    }
    if (cuil && !/^\d{11,11}$/.test(cuil)) {
      setFeedback({ message: "Debe tener 11 dígitos numéricos.", type: "error" });
      return;
    }

   try {
      setLoading(true);
      setFeedback({ message: "", type: "" });

      const res = await fetch("http://localhost:8080/admin/subirEmpleado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre,
          apellido,
          cuil,
          correo,
          contraseña,
          idSucursal,
        }),
      });

if (!res.ok) {
        let errorMessage = "Error al subir el empleado."; 

        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message; 
          } else {
            errorMessage = await res.text();
          }
        } catch (jsonError) {
          errorMessage = await res.text();
        }

        throw new Error(errorMessage); 
      }

      setFeedback({ message: "Empleado creado con éxito.", type: "success" });
      setEmpleadoSubido(true);
      setTimeout(() => router.push("/dashboard-admin/empleados"), 2000);
    } catch (err) {
      setFeedback({
        message: `${(err as Error).message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Alta de <span className="text-amber-600">Empleado</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-500 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2" htmlFor="nombre">Nombre</Label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="apellido">Apellido</Label>
            <input
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="cuil">CUIL</Label>
            <input
              id="cuil"
              value={cuil}
              onChange={(e) => setCuil(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="correo">Correo Electrónico</Label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="contraseña">Contraseña</Label>
            <input
              id="contraseña"
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="sucursal">Sucursal</Label>
            <select
              id="sucursal"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              value={idSucursal}
              onChange={(e) => setIdSucursal(Number(e.target.value))}
              required
            >
              <option value="">Seleccioná una sucursal</option>
              {sucursales.map((s) => (
                <option key={s.idSucursal} value={s.idSucursal}>
                  {s.localidad} - {s.direccion}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white text-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Subiendo empleado..." : "Subir Empleado"}
        </Button>
      </form>

      {empleadoSubido && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg text-green-700">
                ¡Empleado subido!
              </h3>
              <p className="text-sm text-gray-600">
                Redirigiendo a la lista de empleados...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
