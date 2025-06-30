"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

interface PaqueteExtra {
  idPaquete: number;
  tipoPaquete: string;
  precio: number;
  cantidad: number;
}

interface RequestPaqueteExtraDTO {
  idPaquete: number;
  cantidad: number;
}

export default function RegistroAlquilerPage() {
  const router = useRouter();
  const params = useParams();
  const idReserva = params.idReserva as string;

  const [paquetesExtrasDisponibles, setPaquetesExtrasDisponibles] = useState<PaqueteExtra[]>([]);
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState<PaqueteExtra[]>([]);
  const [loading, setLoading] = useState(false);
  const [alquilerRegistrado, setAlquilerRegistrado] = useState(false);
  const [dniConductor, setDniConductor] = useState("");
  const [dniSegundoConductor, setDniSegundoConductor] = useState("");

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const totalPaquetesExtras = useMemo(() => {
    return paquetesSeleccionados.reduce(
      (sum, paquete) => sum + paquete.precio * paquete.cantidad,
      0
    );
  }, [paquetesSeleccionados]);

  const necesitaSegundoConductorInput = useMemo(() => {
    return paquetesSeleccionados.some(paquete =>
      paquete.tipoPaquete.toLowerCase().includes("segundo conductor")
    );
  }, [paquetesSeleccionados]);

  useEffect(() => {
    if (!idReserva) {
      setFeedback({ message: "No se encontró el ID de la reserva.", type: "error" });
      return;
    }

    const fetchPaquetes = async () => {
      setFeedback({ message: "", type: "" });
      try {
        const resPaquetes = await fetch("http://localhost:8080/empleado/obternerPaquetesExtras", {
          credentials: "include",
        });
        if (!resPaquetes.ok) {
          if (resPaquetes.status === 403 || resPaquetes.status === 401) {
            throw new Error("Acceso denegado o sesión expirada. Por favor, inicie sesión nuevamente.");
          }
          throw new Error(`Error al cargar paquetes extra: ${resPaquetes.status} ${resPaquetes.statusText}`);
        }
        const dataPaquetes: PaqueteExtra[] = await resPaquetes.json();
        setPaquetesExtrasDisponibles(dataPaquetes);

      } catch (err) {
        console.error("Error en la carga inicial de datos:", err);
        setFeedback({
          message: `Error en la carga inicial: ${(err as Error).message}`,
          type: "error",
        });
      }
    };

    fetchPaquetes();
  }, [idReserva, router]);

  const handleAddPaquete = (paquete: PaqueteExtra) => {
    const paqueteExistente = paquetesSeleccionados.find((p) => p.idPaquete === paquete.idPaquete);
    if (!paqueteExistente) {
      setPaquetesSeleccionados((prev) => [...prev, { ...paquete, cantidad: 1 }]);
    }
  };

  const handleRemovePaquete = (id: number) => {
    setPaquetesSeleccionados((prev) => prev.filter((paquete) => paquete.idPaquete !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idReserva) {
      setFeedback({ message: "ID de reserva no encontrado.", type: "error" });
      return;
    }

    if (!dniConductor) {
      setFeedback({ message: "Por favor, ingresa el DNI del conductor principal.", type: "error" });
      return;
    }

    const dniRegex = /^\d{7,8}$/;

    if (!dniRegex.test(dniConductor)) {
      setFeedback({ message: "El DNI del conductor principal debe contener 7 u 8 dígitos numéricos.", type: "error" });
      return;
    }

    if (necesitaSegundoConductorInput && dniSegundoConductor) {
      if (!dniRegex.test(dniSegundoConductor)) {
        setFeedback({ message: "El DNI del segundo conductor debe contener 7 u 8 dígitos numéricos.", type: "error" });
        return;
      }
      if (dniConductor === dniSegundoConductor) {
        setFeedback({ message: "El DNI del segundo conductor no puede ser igual al del conductor principal.", type: "error" });
        return;
      }
    }


    setLoading(true);
    setFeedback({ message: "", type: "" });

    const paquetesParaEnviar: RequestPaqueteExtraDTO[] = paquetesSeleccionados.map((p) => ({
      idPaquete: p.idPaquete,
      cantidad: 0,
    }));

    try {
      const res = await fetch("http://localhost:8080/empleado/registrarAlquiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idReserva: Number(idReserva),
          paquetesExtras: paquetesParaEnviar,
          dniConductor,
          dniSegundoConductor: necesitaSegundoConductorInput ? (dniSegundoConductor || null) : null,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Error al registrar el alquiler.";
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

      const data = await res.json();
      setFeedback({ message: data.message || "Alquiler registrado con éxito.", type: "success" });
      setAlquilerRegistrado(true);
      setTimeout(() => router.push("/dashboard-empleado/alquileres"), 2000);
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
        Registrar <span className="text-amber-600">Alquiler</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-500 space-y-6"
      >
        <div className="mb-6">
          <Label className="mb-2 text-lg font-semibold">
            ID de Reserva: <span className="font-normal">{idReserva}</span>
          </Label>
        </div>

        <div>
          <Label className="mb-2" htmlFor="dniConductor">
            DNI Conductor Principal
          </Label>
          <input
            id="dniConductor"
            type="text"
            value={dniConductor}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setDniConductor(value.slice(0, 8));
            }}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
            required
            pattern="^\d{7,8}$"
            title="El DNI debe contener 7 u 8 dígitos numéricos."
            inputMode="numeric"
          />
        </div>

        {necesitaSegundoConductorInput && (
          <div>
            <Label className="mb-2" htmlFor="dniSegundoConductor">
              DNI Segundo Conductor
            </Label>
            <input
              id="dniSegundoConductor"
              type="text"
              value={dniSegundoConductor}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setDniSegundoConductor(value.slice(0, 8));
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm border"
              pattern="^\d{7,8}$"
              title="El DNI debe contener 7 u 8 dígitos numéricos."
              inputMode="numeric"
            />
          </div>
        )}

        <div className="space-y-4">
          <Label className="mb-2 text-lg font-semibold" htmlFor="paquete-extra-select">
            Agregar Paquetes Extra
          </Label>
          <select
            id="paquete-extra-select"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedPaquete = paquetesExtrasDisponibles.find(
                (p) => p.idPaquete === selectedId
              );
              if (selectedPaquete) {
                handleAddPaquete(selectedPaquete);
              }
              e.target.value = "";
            }}
            value=""
          >
            <option value="">Seleccioná un paquete extra</option>
            {paquetesExtrasDisponibles.map((paquete) => (
              <option key={paquete.idPaquete} value={paquete.idPaquete}>
                {paquete.tipoPaquete} - ${paquete.precio.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {paquetesSeleccionados.length > 0 && (
          <div className="mt-6 border p-4 rounded-md bg-gray-50">
            <h3 className="text-md font-semibold mb-3">Paquetes Extra Añadidos:</h3>
            <ul className="space-y-2 mb-4">
              {paquetesSeleccionados.map((paquete) => (
                <li
                  key={paquete.idPaquete}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-200"
                >
                  <div className="flex-grow">
                    <span className="font-medium">{paquete.tipoPaquete}</span> - ${paquete.precio.toFixed(2)}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePaquete(paquete.idPaquete)}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-300 text-right">
              <span className="text-xl font-bold text-amber-700">
                Total Paquetes Extra: ${totalPaquetesExtras.toFixed(2)}
              </span>
            </div>
          </div>
        )}

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
          {loading ? "Registrando alquiler..." : "Registrar Alquiler"}
        </Button>
      </form>

      {alquilerRegistrado && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg text-green-700">
                ¡Alquiler registrado!
              </h3>
              <p className="text-sm text-gray-600">
                Redirigiendo a la lista de alquileres...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}