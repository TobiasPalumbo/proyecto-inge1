// src/app/flota-disponible/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SimularPresupuestoDialog } from "@/components/Presupuesto";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Sucursal = {
  idSucursal: number;
  localidad: string;
  direccion: string;
};

interface AutoDTO {
  idAuto: number;
  idCategoria: number;
  marca: string;
  modelo: string;
  precio: number;
  cantidadAsientos: number;
  categoria: string;
  idPoliticaCancelacion: number;
  porcentaje: number;
  patente: string; 
}

// Interfaz para los datos que se guardan en sessionStorage para la reserva
interface ReservaDataGuardado { 
  idAuto: number;
  fechaEntrega: string;
  fechaRegreso: string;
  horaEntrega: string;
  horaRegreso: string;
  patentes: string[]; 
  sucursalEntregaId: number; 
  sucursalRetiroId: number; // AÑADIDO: Guardar el ID de la sucursal de retiro
  auto: { 
    marca: string;
    modelo: string;
    precioPorDia: number;
    politicaCancelacionPorcentaje: number;
    imageUrl: string;
  };
  fullAutoDTO: AutoDTO;
}


export default function FlotaDisponiblePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { correo, rol, loading: authLoading } = useAuth();

  const isLoggedIn = !!correo && !!rol; 
  const sucursalRetiroId = searchParams.get("sucursalRetiro") || "";
  const sucursalDevolucionId = searchParams.get("sucursalDevolucion") || "";
  const fechaRetiro = searchParams.get("fechaRetiro") || "";
  const fechaDevolucion = searchParams.get("fechaDevolucion") || "";
  const horaRetiro = searchParams.get("horaRetiro") || "";
  const horaDevolucion = searchParams.get("horaDevolucion") || "";

  const [flotaFiltrada, setFlotaFiltrada] = useState<any[]>([]);
  const [loadingFlota, setLoadingFlota] = useState(true);
  const [loadingSucursales, setLoadingSucursales] = useState(true);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [showLoginRequiredDialog, setShowLoginRequiredDialog] = useState(false);

  useEffect(() => {
    async function fetchSucursales() {
      try {
        const res = await fetch("http://localhost:8080/public/sucursales", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Error al obtener sucursales: ${res.status}`);
        const data: Sucursal[] = await res.json();
        setSucursales(data);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
        setSucursales([]);
      } finally {
        setLoadingSucursales(false);
      }
    }
    fetchSucursales();
  }, []);

  useEffect(() => {
    async function fetchFlota() {
      setLoadingFlota(true);

      const body = {
        sucursal: parseInt(sucursalRetiroId),
        fechaEntrega: fechaRetiro,
        fechaRegreso: fechaDevolucion,
        horaEntrega: horaRetiro,
        horaRegreso: horaDevolucion,
      };

      try {
        const res = await fetch("http://localhost:8080/public/autosDisponibles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Error al obtener la flota disponible");
        const data = await res.json();
        setFlotaFiltrada(data); 
      } catch (error) {
        console.error("Error al obtener la flota:", error);
        setFlotaFiltrada([]);
      } finally {
        setLoadingFlota(false);
      }
    }

    if (sucursalRetiroId && !isNaN(parseInt(sucursalRetiroId))) {
      fetchFlota();
    } else {
      setLoadingFlota(false);
      setFlotaFiltrada([]);
    }
  }, [sucursalRetiroId, fechaRetiro, fechaDevolucion, horaRetiro, horaDevolucion, sucursalDevolucionId]);

  const getSucursalName = (id: string | null) => {
    if (!id) return "N/A";
    const sucursal = sucursales.find(s => s.idSucursal.toString() === id);
    return sucursal ? `${sucursal.localidad} - ${sucursal.direccion}` : `ID ${id} (no encontrada)`;
  };

  const handleReservarClick = (item: any) => {
    if (!isLoggedIn) {
      setShowLoginRequiredDialog(true);
      return;
    }

    const reservaData: ReservaDataGuardado = {
      idAuto: item.autoDTO.idAuto,
      fechaEntrega: fechaRetiro,
      fechaRegreso: fechaDevolucion,
      horaEntrega: horaRetiro,
      horaRegreso: horaDevolucion,
      patentes: item.patentes,
      sucursalEntregaId: parseInt(sucursalDevolucionId),
      sucursalRetiroId: parseInt(sucursalRetiroId), // AÑADIDO: Parsear y guardar el ID de la sucursal de retiro
      auto: { 
        marca: item.autoDTO.marca,
        modelo: item.autoDTO.modelo,
        precioPorDia: item.autoDTO.precio,
        politicaCancelacionPorcentaje: item.autoDTO.porcentaje,
        imageUrl: `/flota-imagenes/${item.autoDTO.modelo.toLowerCase()}.jpg`,
      },
      fullAutoDTO: item.autoDTO,
    };

    sessionStorage.setItem("reservaEnProgreso", JSON.stringify(reservaData));
    router.push("/abonar-reserva");
  };

  if (loadingFlota || loadingSucursales || authLoading) {
    return <p>Cargando autos y sucursales disponibles...</p>;
  }

  if (flotaFiltrada.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-4 p-2 border rounded bg-amber-50 text-amber-950 relative"> 
          <h2 className="font-semibold mb-2">Filtros seleccionados:</h2>
          <ul className="space-y-1 text-sm mb-4">
            <li><strong>Sucursal de retiro:</strong> {getSucursalName(sucursalRetiroId)}</li>
            <li><strong>Sucursal de devolución:</strong> {getSucursalName(sucursalDevolucionId)}</li>
            <li><strong>Fecha y hora de retiro:</strong> {fechaRetiro} - {horaRetiro}</li>
            <li><strong>Fecha y hora de devolución:</strong> {fechaDevolucion} - {horaDevolucion}</li>
          </ul>
          <Button
            onClick={() => router.push("/pagina-inicio")} 
            className="bg-amber-800 hover:bg-amber-900 text-white absolute bottom-4 right-4">
            Modificar búsqueda
          </Button>
        </div>
        <p>No hay autos disponibles para ese filtro.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Flota disponible</h1>

      <div className="mb-4 p-2 border rounded bg-amber-50 text-amber-950 relative"> 
        <h2 className="font-semibold mb-2">Filtros seleccionados:</h2>
        <ul className="space-y-1 text-sm mb-4">
          <li><strong>Sucursal de retiro:</strong> {getSucursalName(sucursalRetiroId)}</li>
          <li><strong>Sucursal de devolución:</strong> {getSucursalName(sucursalDevolucionId)}</li>
          <li><strong>Fecha y hora de retiro:</strong> {fechaRetiro} - {horaRetiro}</li>
          <li><strong>Fecha y hora de devolución:</strong> {fechaDevolucion} - {horaDevolucion}</li>
        </ul>

        <Button
          onClick={() => router.push("/pagina-inicio")} 
          className="bg-amber-800 hover:bg-amber-900 text-white absolute bottom-4 right-4">
          Modificar búsqueda
        </Button>
      </div>

      <ul>
        {flotaFiltrada.map((item, index) => (
          <Card key={index} className="mb-4 p-6 border-gray-400/90 border-2">
            <div className="flex gap-4 items-start">
              <div className="w-48 h-32 relative flex-shrink-0 border border-gray-300 rounded overflow-hidden">
                <Image
                  src={`/flota-imagenes/${item.autoDTO.modelo.toLowerCase()}.jpg`}
                  alt={`${item.autoDTO.marca} ${item.autoDTO.modelo}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col w-full">
                <p className="text-lg font-semibold mb-2">
                  {item.autoDTO.marca} {item.autoDTO.modelo}
                </p>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-900">
                  <div className="flex flex-col gap-3">
                    <p>Precio por día: <strong>${item.autoDTO.precio}</strong></p>
                    <p>Categoría: {item.autoDTO.categoria}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p>Asientos: {item.autoDTO.cantidadAsientos}</p>
                    <p>Política de cancelación: Se reintegra {item.autoDTO.porcentaje * 100}%</p>
                  </div>

                  <div className="flex flex-col justify-end gap-4">
                    <SimularPresupuestoDialog
                      autoId={parseInt(item.autoDTO.idAuto)}
                      auto={item.autoDTO}
                      sucursalRetiroNombre={getSucursalName(sucursalRetiroId)}
                      sucursalDevolucionNombre={getSucursalName(sucursalDevolucionId)}
                      fechaEntrega={fechaRetiro}
                      fechaRegreso={fechaDevolucion}
                      horaEntrega={horaRetiro}
                      horaRegreso={horaDevolucion}
                      politicaCancelacion={item.autoDTO.porcentaje}
                      autoImageUrl={`/flota-imagenes/${item.autoDTO.modelo.toLowerCase()}.jpg`}
                    />
                    <Button
                      onClick={() => handleReservarClick(item)}
                      className="bg-amber-800 hover:bg-amber-900 text-white"
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </ul>

      <Dialog open={showLoginRequiredDialog} onOpenChange={setShowLoginRequiredDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Inicia sesión para reservar</DialogTitle>
            <DialogDescription>
              Necesitas una cuenta para poder realizar una reserva.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowLoginRequiredDialog(false)}>Entendido</Button>
            <Button onClick={() => {
                setShowLoginRequiredDialog(false);
                router.push("/logIn");
            }}>Loguearme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}