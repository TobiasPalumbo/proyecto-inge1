"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [rangoFechas, setRangoFechas] = useState<DateRange | undefined>();

  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/sucursales")
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error al traer sucursales:", err))
      .finally(() => setMounted(true));
  }, []);

  if (!mounted || sucursales.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rangoFechas?.from || !rangoFechas?.to) {
      alert("Seleccioná un rango de fechas válido.");
      return;
    }

    const datosParaEnviar = {
      sucursalRetiro,
      sucursalDevolucion: mismaSucursal ? sucursalRetiro : sucursalDevolucion,
      horaRetiro,
      horaDevolucion,
      fechaRetiro: rangoFechas.from.toISOString().split("T")[0],
      fechaDevolucion: rangoFechas.to.toISOString().split("T")[0],
    };

    try {
      const response = await fetch("http://localhost:8080/buscarautos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar),
      });

      if (!response.ok) {
        throw new Error("Error en la búsqueda de autos");
      }

      router.push("/listado-autos");
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Ocurrió un error al buscar autos.");
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <Card className="w-[1000px] shadow-lg border shadow-amber-950/85 bg-white/80"> {/* Aquí puedes ajustar la opacidad de la Card principal */}
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          >
            {/* Columna 1 */}
            <div className="flex flex-col gap-4">
              <Select
                onValueChange={(value) =>
                  setMismaSucursal(value === "mismaSucursal")
                }
              >
                <SelectTrigger className="w-full bg-white"> 
                  <SelectValue placeholder="Seleccionar punto de devolución" />
                </SelectTrigger>
                <SelectContent className="bg-white"> {/* Añadimos bg-white para el contenido del Select */}
                  <SelectGroup>
                    <SelectItem value="mismaSucursal">
                      Mismo punto de devolución
                    </SelectItem>
                    <SelectItem value="distintaSucursal">
                      Distinto punto de devolución
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                onValueChange={setSucursalRetiro}
                value={sucursalRetiro}
              >
                <SelectTrigger className="w-full bg-white"> {/* Añadimos bg-white */}
                  <SelectValue placeholder="Sucursal de Retiro" />
                </SelectTrigger>
                <SelectContent className="bg-white"> {/* Añadimos bg-white para el contenido del Select */}
                  <SelectGroup>
                    {sucursales.map((s) => (
                      <SelectItem
                        key={s.idSucursal}
                        value={s.idSucursal.toString()}
                      >
                        {s.localidad} - {s.direccion}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {!mismaSucursal && (
                <Select
                  onValueChange={setSucursalDevolucion}
                  value={sucursalDevolucion}
                >
                  <SelectTrigger className="w-full bg-white"> 
                    <SelectValue placeholder="Sucursal de Devolución" />
                  </SelectTrigger>
                  <SelectContent className="bg-white"> 
                    <SelectGroup>
                      {sucursales.map((s) => (
                        <SelectItem
                          key={s.idSucursal}
                          value={s.idSucursal.toString()}
                        >
                          {s.localidad} - {s.direccion}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col gap-4">
              <div>
                <Label>Rango de fechas</Label>
                {/* DatePickerWithRange probablemente necesite un ajuste interno o su propio className si su fondo es transparente */}
                {/* Por ahora, asumo que sus componentes internos son opacos o puedes modificarlo directamente si es tu componente */}
                <DatePickerWithRange
                  value={rangoFechas}
                  onSelect={setRangoFechas}
                  // Si DatePickerWithRange permite className, puedes añadir:
                  // className="bg-white"
                />
              </div>
            </div>

            {/* Columna 3 */}
            <div className="flex flex-col gap-4 justify-end">
              <div>
                <Label htmlFor="horaRetiro">Hora de Retiro</Label>
                <Input
                  type="time"
                  id="horaRetiro"
                  value={horaRetiro}
                  onChange={(e) => setHoraRetiro(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div>
                <Label htmlFor="horaDevolucion">Hora de Devolución</Label>
                <Input
                  type="time"
                  id="horaDevolucion"
                  placeholder="09:00"
                  value={horaDevolucion}
                  onChange={(e) => setHoraDevolucion(e.target.value)}
                  required
                  className="bg-white" 
                />
              </div>

              <Button
                type="submit"
                className="bg-amber-900 hover:bg-amber-800 text-white"
              >
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}