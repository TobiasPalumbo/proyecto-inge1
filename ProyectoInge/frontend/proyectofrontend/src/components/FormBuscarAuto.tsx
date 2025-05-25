"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
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
      const response = await fetch("http://localhost:8080/presupuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar),
      });

      if (!response.ok) {
        throw new Error("Error en la búsqueda de autos");
      }
      else{
      router.push("/presupuesto");
    }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Ocurrió un error al generar presupuesto");
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <Card className="w-[1000px] shadow-lg border shadow-amber-950/85 bg-amber-50/70"> 
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          >

            
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-black mb-2 font-normal text-sm ">Rango de fechas</Label>
                <DatePickerWithRange
                  value={rangoFechas}
                  onSelect={setRangoFechas}
                  className="bg-white text-black border border-gray-400 rounded-md"
                />
              </div>
            </div>
            {/* Columna 1 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
          <Checkbox
          id="distintaSucursalCheckbox"
          checked={!mismaSucursal}
          onCheckedChange={(checked) => setMismaSucursal(!checked)}
          className="bg-white border-gray-800"
        />
        <label htmlFor="distintaSucursalCheckbox" className=" text-black font-normal text-sm select-none">
          Devolver en distinta sucursal
        </label>
        </div>
              <Select
                onValueChange={setSucursalRetiro}
                value={sucursalRetiro}
              >
                <SelectTrigger className="w-full bg-white text-black  border-gray-400 mb-4"> 
                  <SelectValue placeholder="Sucursal de Retiro" />
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

              {!mismaSucursal && (
                <Select
                  onValueChange={setSucursalDevolucion}
                  value={sucursalDevolucion}
                >
                  <SelectTrigger className="w-full bg-white text-black  border-gray-400"> 
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


            {/* Columna 3 */}
            <div className="flex flex-col gap-4 justify-end">
              <div>
                <Label htmlFor="horaRetiro" className="text-black mb-2 font-normal text-sm ">Hora de Retiro</Label>
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
                <Label htmlFor="horaDevolucion" className="text-black mb-2 font-normal text-sm ">Hora de Devolución</Label>
                <Input
                  type="time"
                  id="horaDevolucion"
                  placeholder="09:00"
                  value={horaDevolucion}
                  onChange={(e) => setHoraDevolucion(e.target.value)}
                  required
                  className="bg-white text-black border-gray-400" 
                />
              </div>


              <Button
                type="submit"
                className= "bg-amber-900 hover:bg-amber-800 text-white shadow-amber-950"
              >
                Generar presupuesto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}