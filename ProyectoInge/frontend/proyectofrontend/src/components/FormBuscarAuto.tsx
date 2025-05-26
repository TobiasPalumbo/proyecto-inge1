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

type Sucursal = {
  idSucursal: number;
  localidad: string;
  direccion: string;
};

type MarcasSucursalesResponse = {
    marcas: string[];
    sucursales: Sucursal[];
    politicas: any[];
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

  const [marcas, setMarcas] = useState<string[]>([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [modelos, setModelos] = useState<string[]>([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");

  const [mostrarFiltrosAuto, setMostrarFiltrosAuto] = useState(false);

  const router = useRouter();

  // Función auxiliar para parsear JSON de forma segura
  const parseJsonResponse = async (response: Response) => {
    if (response.status === 204 || response.headers.get('Content-Length') === '0' || !response.headers.get('Content-Type')?.includes('application/json')) {
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

  // Efecto para cargar sucursales
  useEffect(() => {
    fetch("http://localhost:8080/public/sucursales", {
      credentials: "include",
    })
      .then(parseJsonResponse)
      .then((data: Sucursal[] | null) => {
          if (data) setSucursales(data);
          else setSucursales([]);
      })
      .catch((err) => console.error("Error al traer sucursales:", err))
      .finally(() => setMounted(true));
  }, []);

  // Efecto para cargar marcas
  useEffect(() => {
    if (mounted && sucursales.length > 0) {
      fetch("http://localhost:8080/public/subirauto", {
        credentials: "include",
      })
        .then(parseJsonResponse)
        .then((data: MarcasSucursalesResponse | null) => {
            if (data && data.marcas) setMarcas(data.marcas);
            else setMarcas([]);
        })
        .catch((err) => console.error("Error al traer marcas:", err));
    }
  }, [mounted, sucursales]);

  // Efecto para cargar modelos cuando se selecciona una marca
  useEffect(() => {
    if (marcaSeleccionada) {
      fetch(`http://localhost:8080/public/subirauto/marca/${marcaSeleccionada}`, {
        credentials: "include",
      })
        .then(parseJsonResponse)
        .then((data: string[] | null) => {
            if (data) setModelos(data);
            else setModelos([]);
        })
        .catch((err) => console.error("Error al traer modelos:", err));
    } else {
      setModelos([]);
      setModeloSeleccionado("");
    }
  }, [marcaSeleccionada]);

  // Efecto: Controla la visibilidad de los filtros de auto automáticamente
  useEffect(() => {
    const isMainFormComplete =
      rangoFechas?.from &&
      rangoFechas?.to &&
      sucursalRetiro &&
      (mismaSucursal || sucursalDevolucion) &&
      horaRetiro &&
      horaDevolucion;

    setMostrarFiltrosAuto(!!isMainFormComplete);
  }, [rangoFechas, sucursalRetiro, sucursalDevolucion, mismaSucursal, horaRetiro, horaDevolucion]);


  if (!mounted || sucursales.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    if (!horaRetiro || !horaDevolucion) {
        alert("Por favor, ingresa la hora de retiro y devolución.");
        return;
    }

    const [retrievalHour, retrievalMinute] = horaRetiro.split(':').map(Number);
    const retrievalDateTime = new Date(rangoFechas!.from!);
    retrievalDateTime.setHours(retrievalHour, retrievalMinute, 0, 0);

    const [returnHour, returnMinute] = horaDevolucion.split(':').map(Number);
    const returnDateTime = new Date(rangoFechas!.to!);
    returnDateTime.setHours(returnHour, returnMinute, 0, 0);

    if (!rangoFechas?.from || !rangoFechas?.to) {
      alert("Seleccioná un rango de fechas válido.");
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

    if (retrievalDateTime < now) {
      alert("La fecha y hora de retiro no pueden ser anteriores al momento actual.");
      return;
    }
    if (returnDateTime <= retrievalDateTime) {
      alert("La fecha y hora de devolución deben ser posteriores a la de retiro.");
      return;
    }

    // Validaciones: Marca y Modelo son obligatorios
    if (!marcaSeleccionada) {
        alert("Por favor, seleccioná una marca de auto.");
        return;
    }
    if (!modeloSeleccionado) {
        alert("Por favor, seleccioná un modelo de auto.");
        return;
    }

    const datosParaEnviar = {
      sucursalRetiro,
      sucursalDevolucion: mismaSucursal ? sucursalRetiro : sucursalDevolucion,
      horaRetiro,
      horaDevolucion,
      fechaRetiro: rangoFechas?.from?.toISOString().split("T")[0],
      fechaDevolucion: rangoFechas?.to?.toISOString().split("T")[0],
      marca: marcaSeleccionada,
      modelo: modeloSeleccionado,
    };

    console.log("Datos a enviar para presupuesto:", datosParaEnviar);

    try {
      const response = await fetch("http://localhost:8080/public/presupuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar),
        credentials: "include",
      });

      if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error del servidor: ${response.status}`);
        } catch (e) {
            throw new Error(`Error en la búsqueda de autos. Código: ${response.status}`);
        }
      } else {
        router.push("/presupuesto");
      }
    } catch (error: any) {
      console.error("Error en la búsqueda:", error);
      alert("Ocurrió un error al generar presupuesto: " + error.message);
    }
  };

  return (
    <div className="w-full flex justify-center px-2">
      <Card className="w-[1000px] shadow-lg border shadow-amber-950/85 bg-amber-50/70">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
            id="main-form"
          >
            {/* Columna de Fechas Y AHORA Marca/Modelo */}
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-black mb-2 font-normal text-sm">
                  Rango de fechas
                </Label>
                <FechaRangoNuevo value={rangoFechas} onChange={setRangoFechas} />
              </div>

              {/* Sección de filtros de Marca y Modelo - APARECE DENTRO DE ESTA COLUMNA */}
              {mostrarFiltrosAuto && (
                <>
                  <div className="mt-w"> {/* Un poco de margen superior */}
                    <Label className="text-black mb-2 font-normal text-sm">
                      Marca de Auto
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        setMarcaSeleccionada(value);
                        setModeloSeleccionado("");
                      }}
                      value={marcaSeleccionada}
                    >
                      <SelectTrigger className="w-full bg-white text-black border-gray-400">
                        <SelectValue placeholder="Seleccioná una marca" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {marcas.map((nombreMarca) => (
                            <SelectItem key={nombreMarca} value={nombreMarca}>
                              {nombreMarca}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {marcaSeleccionada && (
                    <div className="mt-2">
                      <Label className="text-black mb-2 font-normal text-sm">
                        Modelo de Auto
                      </Label>
                      <Select
                        onValueChange={setModeloSeleccionado}
                        value={modeloSeleccionado}
                      >
                        <SelectTrigger className="w-full bg-white text-black border-gray-400">
                          <SelectValue placeholder="Seleccioná un modelo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            {modelos.map((nombreModelo) => (
                              <SelectItem key={nombreModelo} value={nombreModelo}>
                                {nombreModelo}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
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

              <Select
                onValueChange={setSucursalRetiro}
                value={sucursalRetiro}
              >
                <SelectTrigger className="w-full bg-white text-black border-gray-400 mb-9">
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
                  <SelectTrigger className="w-full bg-white text-black border-gray-400">
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

            {/* Columna de Horarios (Ahora solo contiene horarios) */}
            <div className="flex flex-col gap-4">
              <div>
                <Label
                  htmlFor="horaRetiro"
                  className="text-black mb-2 font-normal text-sm"
                >
                  Hora de Retiro
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
                <Label
                  htmlFor="horaDevolucion"
                  className="text-black mb-2 font-normal text-sm"
                >
                  Hora de Devolución
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

          {/* Botones al final del CardContent, debajo del formulario */}
          <div className="mt-8 pt-6 border-t border-gray-300 flex flex-col sm:flex-row justify-end gap-4">
            <Button
              type="submit"
              className="bg-amber-900 hover:bg-amber-800 text-white shadow-amber-950 w-full sm:w-auto"
              form="main-form"
            >
              Generar presupuesto
            </Button>
            {/* Aquí iría el futuro botón "Reservar" */}
            {/* <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-500 text-white w-full sm:w-auto"
              // Agrega lógica para solo mostrar si el usuario está logueado
            >
              Reservar
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}