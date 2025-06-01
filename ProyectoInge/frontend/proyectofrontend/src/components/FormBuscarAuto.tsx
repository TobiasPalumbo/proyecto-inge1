"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FechaRangoNuevo from "./ui/FechaRangoNuevo";
import { useAuth } from "@/context/AuthContext";

type Sucursal = {
  idSucursal: number;
  localidad: string;
  direccion: string;
};

export function FormBuscarAuto() {
  const [mounted, setMounted] = useState(false);
  const [mismaSucursal, setMismaSucursal] = useState(true);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalRetiro, setSucursalRetiro] = useState("");
  const [sucursalDevolucion, setSucursalDevolucion] = useState("");
  const [horaRetiro, setHoraRetiro] = useState("");
  const [horaDevolucion, setHoraDevolucion] = useState("");
  const [rangoFechas, setRangoFechas] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const router = useRouter();
  const { correo } = useAuth();

  const parseJsonResponse = async (response: Response) => {
    if (
      response.status === 204 ||
      response.headers.get("Content-Length") === "0" ||
      !response.headers.get("Content-Type")?.includes("application/json")
    ) {
      return null;
    }
    if (!response.ok) {
      try {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    return response.json();
  };

  // Cargar sucursales y datos guardados
  useEffect(() => {
    fetch("http://localhost:8080/public/sucursales", {
      credentials: "include",
    })
      .then(parseJsonResponse)
      .then((data: Sucursal[] | null) => {
        if (data) {
          setSucursales(data);
          // Seleccionar la primera sucursal por defecto si no hay datos guardados
          const saved = sessionStorage.getItem("formBuscarAuto");
          if (!saved && data.length > 0) {
            setSucursalRetiro(data[0].idSucursal.toString());
            setSucursalDevolucion(data[0].idSucursal.toString());
          }
        } else setSucursales([]);
      })
      .catch((err) => console.error("Error al traer sucursales:", err))
      .finally(() => setMounted(true));
  }, []);

  // Cargar datos guardados de sessionStorage al montar
  useEffect(() => {
    const saved = sessionStorage.getItem("formBuscarAuto");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sucursalRetiro) setSucursalRetiro(parsed.sucursalRetiro);
        if (parsed.sucursalDevolucion) setSucursalDevolucion(parsed.sucursalDevolucion);
        if (typeof parsed.mismaSucursal === "boolean") setMismaSucursal(parsed.mismaSucursal);
        if (parsed.horaRetiro) setHoraRetiro(parsed.horaRetiro);
        if (parsed.horaDevolucion) setHoraDevolucion(parsed.horaDevolucion);
        if (parsed.rangoFechas) {
          // Convertir strings a Date
          setRangoFechas({
            from: parsed.rangoFechas.from ? new Date(parsed.rangoFechas.from) : undefined,
            to: parsed.rangoFechas.to ? new Date(parsed.rangoFechas.to) : undefined,
          });
        }
      } catch (error) {
        console.warn("No se pudo parsear sessionStorage formBuscarAuto", error);
      }
    }
  }, []);

  // Guardar automáticamente al cambiar cualquiera de estos estados
  useEffect(() => {
    // Solo guardar si ya montó y hay sucursales
    if (!mounted || sucursales.length === 0) return;

    sessionStorage.setItem(
      "formBuscarAuto",
      JSON.stringify({
        mismaSucursal,
        sucursalRetiro,
        sucursalDevolucion,
        horaRetiro,
        horaDevolucion,
        rangoFechas,
      })
    );
  }, [mismaSucursal, sucursalRetiro, sucursalDevolucion, horaRetiro, horaDevolucion, rangoFechas, mounted, sucursales.length]);

  if (!mounted || sucursales.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    if (!rangoFechas?.from || !rangoFechas?.to) {
      alert("Seleccioná un rango de fechas válido.");
      return;
    }
    if (!horaRetiro || !horaDevolucion) {
      alert("Por favor, ingresa la hora de retiro y devolución.");
      return;
    }
    if (!sucursalRetiro) {
      alert("Seleccioná una sucursal de retiro.");
      return;
    }
    if (!mismaSucursal && !sucursalDevolucion) {
      alert("Seleccioná una sucursal de devolución.");
      return;
    }

    const [retrievalHour, retrievalMinute] = horaRetiro.split(":").map(Number);
    const retrievalDateTime = new Date(rangoFechas.from);
    retrievalDateTime.setHours(retrievalHour, retrievalMinute, 0, 0);

    const [returnHour, returnMinute] = horaDevolucion.split(":").map(Number);
    const returnDateTime = new Date(rangoFechas.to);
    returnDateTime.setHours(returnHour, returnMinute, 0, 0);

    if (retrievalDateTime < now) {
      alert("La fecha y hora de retiro no pueden ser anteriores al momento actual.");
      return;
    }
    if (returnDateTime <= retrievalDateTime) {
      alert("La fecha y hora de devolución deben ser posteriores a la de retiro.");
      return;
    }

    // Guardar en sessionStorage (por si quieren seguir en la página de búsqueda)
    sessionStorage.setItem(
      "formBuscarAuto",
      JSON.stringify({
        mismaSucursal,
        sucursalRetiro,
        sucursalDevolucion: mismaSucursal ? sucursalRetiro : sucursalDevolucion,
        horaRetiro,
        horaDevolucion,
        rangoFechas,
      })
    );

    const params = new URLSearchParams({
      sucursalRetiro,
      sucursalDevolucion: mismaSucursal ? sucursalRetiro : sucursalDevolucion,
      fechaRetiro: rangoFechas.from.toISOString().split("T")[0],
      fechaDevolucion: rangoFechas.to.toISOString().split("T")[0],
      horaRetiro,
      horaDevolucion,
    });

    router.push(`/flota-disponible?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center px-2">
      <Card className="w-[1000px] shadow-lg border shadow-amber-950/85 bg-amber-50/65">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
            id="main-form"
          >
            {/* Columna de Fechas */}
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-black mb-2 font-normal text-sm">
                  Rango de fechas <span className="text-red-600">*</span>
                </Label>
                <FechaRangoNuevo value={rangoFechas} onChange={setRangoFechas} />
              </div>
            </div>

            {/* Columna de Sucursales */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="distintaSucursalCheckbox"
                  checked={!mismaSucursal}
                  onCheckedChange={(checked) => {
                    setMismaSucursal(!checked);
                    if (!checked) {
                      setSucursalDevolucion("");
                    }
                  }}
                  className="bg-white border-gray-800"
                />
                <label
                  htmlFor="distintaSucursalCheckbox"
                  className="text-black font-normal text-sm select-none"
                >
                  Devolver en distinta sucursal
                </label>
              </div>
              <Select onValueChange={setSucursalRetiro} value={sucursalRetiro}>
                <SelectTrigger className="w-full bg-white text-black border-gray-400 mb-9">
                  <SelectValue placeholder="Sucursal de Retiro" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {sucursales.map((s) => (
                      <SelectItem key={s.idSucursal} value={s.idSucursal.toString()}>
                        {s.localidad} - {s.direccion}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {!mismaSucursal && (
                <Select onValueChange={setSucursalDevolucion} value={sucursalDevolucion}>
                  <SelectTrigger className="w-full bg-white text-black border-gray-400">
                    <SelectValue placeholder="Sucursal de Devolución" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {sucursales.map((s) => (
                        <SelectItem key={s.idSucursal} value={s.idSucursal.toString()}>
                          {s.localidad} - {s.direccion}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Columna de Horarios */}
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="horaRetiro" className="text-black mb-2 font-normal text-sm">
                  Hora de Retiro<span className="text-red-600">*</span>
                </Label>
                <Input
                  type="time"
                  id="horaRetiro"
                  value={horaRetiro}
                  onChange={(e) => setHoraRetiro(e.target.value)}
                  required
                  className="bg-white text-black border-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="horaDevolucion" className="text-black mb-2 font-normal text-sm">
                  Hora de Devolución<span className="text-red-600">*</span>
                </Label>
                <Input
                  type="time"
                  id="horaDevolucion"
                  value={horaDevolucion}
                  onChange={(e) => setHoraDevolucion(e.target.value)}
                  required
                  className="bg-white text-black border-gray-400"
                />
              </div>
            </div>
          </form>
          <div className="pt-3 border-t border-gray-300 flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <Button
              type="submit"
              className="mt-1 mr-2 bg-amber-900 hover:bg-amber-800 text-white shadow-amber-950 w-full sm:w-auto"
              form="main-form"
            >
              Ver flota disponible
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}