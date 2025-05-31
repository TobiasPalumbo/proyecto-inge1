"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Icons } from "@/components/icons";

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
interface ReservaData {
  idAuto: number;
  fechaEntrega: string;
  fechaRegreso: string;
  horaEntrega: string;
  horaRegreso: string;
  patentes: string[];
  sucursalEntregaId: number; // Esta es la sucursal de devolución
  sucursalRetiroId: number;
  auto: {
    marca: string;
    modelo: string;
    precioPorDia: number;
    politicaCancelacionPorcentaje: number;
    imageUrl: string;
  };
  precioTotal?: number;
  fullAutoDTO: AutoDTO;
}
interface AlertDialogState {
  show: boolean;
  title: string;
  description: string;
  variant: "default" | "destructive";
}


  type PaymentFormErrorState = {
  message: string | null;
  timestamp?: number;
  }; 


export default function AbonarReservaPage() {
  const router = useRouter();
  const [reservaExitosa, setReservaExitosa] = useState(false);
  const [reservaData, setReservaData] = useState<ReservaData | null>(null);
  const [loadingPresupuesto, setLoadingPresupuesto] = useState(false);
  const [errorPresupuesto, setErrorPresupuesto] = useState<string | null>(null);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(true);
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [numero, setNumero] = useState("");
  const [fechaVencimientoInput, setFechaVencimientoInput] = useState("");
  const [cvv, setCvv] = useState("");
  const [nombre, setNombre] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [alertDialog, setAlertDialog] = useState<AlertDialogState>({
    show: false,
    title: "",
    description: "",
    variant: "default",
  });


  const [paymentFormError, setPaymentFormError] = useState<PaymentFormErrorState>({ message: null });


  const showAlert = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setAlertDialog({ show: true, title, description, variant });
    setTimeout(() => {
      setAlertDialog(prev => ({ ...prev, show: false }));
    }, 5000); // 5 segundos
  };

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
        showAlert("Error de carga", "No se pudieron cargar las sucursales.", "destructive");
      } finally {
        setLoadingSucursales(false);
      }
    }
    fetchSucursales();
  }, []);

 const fetchPresupuesto = useCallback(async (currentReservaData: ReservaData) => {
  setLoadingPresupuesto(true); // Siempre iniciar la carga
  setErrorPresupuesto(null);   // Siempre limpiar errores previos

  try {
    // Aquí es importante usar 'await' para que la promesa del fetch se resuelva
    const response = await fetch("http://localhost:8080/public/simularPresupuesto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentReservaData.idAuto,
        fechaEntrega: currentReservaData.fechaEntrega,
        fechaRegreso: currentReservaData.fechaRegreso
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al simular presupuesto: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    setReservaData(prevData => {
      if (prevData) {
        const updatedData = { ...prevData, precioTotal: data.presupuesto };
        sessionStorage.setItem("reservaEnProgreso", JSON.stringify(updatedData));
        return updatedData;
      }
      return prevData;
    });
  } catch (error: any) {
    console.error("Error al obtener presupuesto:", error);
    setErrorPresupuesto(error.message || "No se pudo obtener el presupuesto. Por favor, inténtalo de nuevo.");
    showAlert("Error", error.message || "No se pudo obtener el presupuesto. Por favor, inténtalo de nuevo.", "destructive");
  } finally {
    setLoadingPresupuesto(false); // Siempre finalizar la carga
  }
}, []);

  useEffect(() => {
    if (!loadingSucursales) {
      const storedReserva = sessionStorage.getItem("reservaEnProgreso");
      if (storedReserva) {
        const parsedData: ReservaData = JSON.parse(storedReserva);
        setReservaData(parsedData);

        if (parsedData.precioTotal === undefined || parsedData.precioTotal === null) {
          fetchPresupuesto(parsedData);
        }
      } else {
        router.push("/flota-disponible");
      }
    }
  }, [router, fetchPresupuesto, loadingSucursales]);

  const getSucursalNameById = useCallback((id: number) => {
    if (loadingSucursales) return `Cargando...`;
    const sucursal = sucursales.find(s => s.idSucursal === id);
    return sucursal ? `${sucursal.localidad} - ${sucursal.direccion}` : `ID ${id} (no encontrada)`;
  }, [sucursales, loadingSucursales]);

  const handleCancelReservation = () => {
    if (reservaData && reservaData.sucursalRetiroId !== undefined && reservaData.fechaEntrega) {
    const queryParams = new URLSearchParams({
      sucursalRetiro: reservaData.sucursalRetiroId.toString(),
      sucursalDevolucion: reservaData.sucursalEntregaId.toString(),
      fechaRetiro: reservaData.fechaEntrega,
      fechaDevolucion: reservaData.fechaRegreso,
      horaRetiro: reservaData.horaEntrega,
      horaDevolucion: reservaData.horaRegreso,
    });
      sessionStorage.removeItem("reservaEnProgreso");
      router.push(`/flota-disponible?${queryParams.toString()}`);}
  else{
    sessionStorage.removeItem("reservaEnProgreso"); 
      router.push("/flota-disponible"); 
  }};

  const handleFechaVencimientoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const digits = value.replace(/\D/g, '');

    let formattedValue = "";
    if (digits.length > 0) {
      formattedValue = digits.slice(0, 2);
    }
    if (digits.length > 2) {
      formattedValue += '/' + digits.slice(2, 4);
    }
    setFechaVencimientoInput(formattedValue);
  };

  const handlePagar = async () => {
    setProcesandoPago(true);
    setPaymentFormError({ message: null });

    if (!numero || !fechaVencimientoInput || !cvv || !nombre) {
      setPaymentFormError({ message: "Por favor, completa todos los campos de la tarjeta para continuar.", timestamp: Date.now() });
      setProcesandoPago(false);
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(fechaVencimientoInput)) {
      setPaymentFormError({ message: "Formato de fecha de vencimiento inválido. Usa MM/AA.", timestamp: Date.now() });
      setProcesandoPago(false);
      return;
    }
    const [expMonthStr, expYearSuffixStr] = fechaVencimientoInput.split('/');
    const expMonth = parseInt(expMonthStr, 10);
    const expYear = parseInt(`20${expYearSuffixStr}`, 10);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (expMonth < 1 || expMonth > 12) {
      setPaymentFormError({ message: "Mes de vencimiento inválido.", timestamp: Date.now() });
      setProcesandoPago(false);
      return;
    }
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      setPaymentFormError({ message: "La tarjeta está vencida.", timestamp: Date.now() });
      setProcesandoPago(false);
      return;
    }
    const formattedApiExpiryDate = `${expYear}-${expMonthStr.padStart(2, '0')}-01`;

    const reservaRequest = {
      fechaEntrega: reservaData!.fechaEntrega,
      fechaRegreso: reservaData!.fechaRegreso,
      horaEntrega: reservaData!.horaEntrega,
      horaRegreso: reservaData!.horaRegreso,
      patentes: reservaData!.patentes,
      sucursalEntregaId: reservaData!.sucursalEntregaId,
      sucursalRetiroId: reservaData!.sucursalRetiroId
    };

    const body = {
      numero,
      nombreTitular: nombre,
      fechaVencimiento: formattedApiExpiryDate,
      CVV: cvv,
      monto: reservaData!.precioTotal,
      reservaRequest: reservaRequest
    };

    try {
      const response = await fetch("http://localhost:8080/pagarConTarjeta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (response.ok) {
        showAlert("Pago Exitoso", `Tu pago con ${metodoPago === "tarjeta" ? "tarjeta de crédito" : "Mercado Pago"} ha sido procesado correctamente. ¡Gracias por tu reserva!`, "default");
        sessionStorage.removeItem("reservaEnProgreso");
        setReservaExitosa(true);

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        // En caso de error, intentar leer el cuerpo solo una vez.
        // Si el Content-Type es 'application/json', intenta leerlo como JSON.
        // De lo contrario, o si falla la lectura JSON, intenta leerlo como texto.
        let errorMessage = `Error: ${response.status} ${response.statusText}`;

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
          } catch (jsonParseError) {
            console.warn("La respuesta del servidor se esperaba JSON pero falló el parseo:", jsonParseError);
            // Si falla el parseo de JSON, y aún estamos seguros de que no fue consumido antes,
            // podríamos intentar leer como texto. Pero dado que se esperaba JSON y falló,
            // el error original del JSON ya es informativo.
            // Para evitar doble consumo, mejor simplemente usar el mensaje predeterminado o un fallback genérico.
            errorMessage = `Error: Respuesta del servidor no es JSON válido. Estado: ${response.status} ${response.statusText}`;
          }
        } else {
          // Si no es JSON o no se especificó un Content-Type, intenta leer como texto.
          // Asegúrate de que el cuerpo no haya sido consumido previamente (en este flujo, no lo fue).
          try {
            const textResponse = await response.text();
            errorMessage = textResponse.trim() !== '' ? textResponse : errorMessage; // Usa el texto si existe
          } catch (textParseError) {
            console.warn("No se pudo leer la respuesta del servidor como texto:", textParseError);
            errorMessage = `Error desconocido del servidor (${response.status}).`;
          }
        }

        setPaymentFormError({ message: `Error al procesar el pago: ${errorMessage}`, timestamp: Date.now() });
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor (red o cliente):", error);
      setPaymentFormError({ message: "Error en la comunicación con el servidor. Por favor, intenta de nuevo.", timestamp: Date.now() });
    } finally {
      setProcesandoPago(false);
    }
  };
  
    if (!reservaData || loadingSucursales) {
    return <p>Cargando datos de la reserva y sucursales...</p>;
  }
  return (
    <div className="px-8 py-6">
      {reservaExitosa && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Alert className="max-w-sm">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <AlertTitle>¡Reserva exitosa!</AlertTitle>
                <AlertDescription>
                  Serás redirigido a la página de inicio...
                </AlertDescription>
          </Alert>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-5 ">Confirmar y Abonar Reserva</h1>
      {alertDialog.show && (
        <Alert variant={alertDialog.variant} className="mb-4">
          <AlertTitle>{alertDialog.title}</AlertTitle>
          <AlertDescription>{alertDialog.description}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* FORMULARIO DE PAGO A LA IZQUIERDA */}
        {reservaData.precioTotal !== undefined && !loadingPresupuesto && !errorPresupuesto ? (
          <Card className=" rounded-xl shadow-md border border-gray-400 bg-white mx-auto ">
            <CardHeader>
              <CardTitle>Datos de Pago</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="text-lg font-semibold text-blue-800">Total a pagar:</p>
                <p className="text-xl font-bold text-blue-800">${reservaData.precioTotal.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                
                <Card
                  className={`cursor-pointer transition-all duration-200 ease-in-out ${metodoPago === "tarjeta" ? "border-primary shadow-lg ring-2 ring-primary" : "border-muted hover:border-gray-400"}`}
                  onClick={() => setMetodoPago("tarjeta")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 h-full">
                    <Icons.creditcard className="mb-1 h-8 w-8 text-gray-700" />
                    <span className="text-sm font-medium text-gray-800 text-center">Tarjeta de Crédito</span>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer transition-all duration-200 ease-in-out ${metodoPago === "mercado-pago" ? "border-primary shadow-lg ring-2 ring-primary" : "border-muted hover:border-gray-400"}`}
                  onClick={() => setMetodoPago("mercado-pago")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 h-full">
                    <Image
                      src="/mercado-pago.jpg"
                      alt="mercadopago"
                      width={60}
                      height={60}
                      className="mb-1"
                    />
                    <span className="text-sm font-medium text-gray-800 text-center">Mercado Pago</span>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number">Número de tarjeta</Label>
                <Input id="number" placeholder="XXXX XXXX XXXX XXXX" value={numero} onChange={e => setNumero(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Vencimiento</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/AA"
                    value={fechaVencimientoInput}
                    onChange={handleFechaVencimientoInputChange}
                    maxLength={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} maxLength={4} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del titular</Label>
                <Input id="name" placeholder="Nombre y Apellido" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
          
          {paymentFormError.message && (
    <div className="text-red-600 text-sm font-medium text-center -mt-4 mb-2" key={paymentFormError.timestamp}>
      {paymentFormError.message}
    </div>
  )}

  <CardFooter>
    <Button className="w-full bg-black text-white" onClick={handlePagar} disabled={procesandoPago} variant="default">
      {procesandoPago ? "Procesando..." : (metodoPago === "mercado-pago" ? "Pagar con Mercado Pago" : "Pagar con Tarjeta")}
    </Button>
  </CardFooter>

            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-500 mt-8 md:col-span-full">
            {loadingPresupuesto ? "Obteniendo datos de pago..." : "Esperando presupuesto para cargar opciones de pago."}
          </p>
        )}

        <div className="mb-6 md:mb-0">
          <div className="p-4 border rounded border-gray-400 bg-white">
            <h2 className="text-xl font-semibold mb-3">Resumen de tu Reserva</h2>
            <div className="flex items-center mb-4">
            
              <Image
                src={reservaData?.auto?.imageUrl || '/placeholder-car.jpg'} 
                alt={`${reservaData?.auto?.marca || 'Auto'} ${reservaData?.auto?.modelo || 'Modelo'}`}
                width={120}
                height={80}
                className="object-cover rounded mr-6"
              />
              <div>
                <p className="text-lg font-bold">{reservaData?.auto?.marca} {reservaData?.auto?.modelo}</p>
                <p className="text-sm text-gray-600">Categoría: {reservaData?.fullAutoDTO?.categoria}</p>
                <p className="text-sm text-gray-600">Asientos: {reservaData?.fullAutoDTO?.cantidadAsientos}</p>
              </div>
            </div>
            {loadingPresupuesto ? (
              <p className="text-xl font-bold mt-4 text-blue-600">Calculando monto total...</p>
            ) : errorPresupuesto ? (
              <p className="text-xl font-bold mt-4 text-red-600">{errorPresupuesto}</p>
            ) : (
              <p className="text-xl font-bold mt-4">Monto Total: ${reservaData.precioTotal?.toFixed(2) || 'N/A'}</p>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">Ver Detalles de Reserva</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Detalles Completos de la Reserva</DialogTitle>
                  <DialogDescription>
                    Información detallada sobre el auto y los términos de tu reserva.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Marca:</Label>
                    <span className="col-span-3">{reservaData?.auto?.marca}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Modelo:</Label>
                    <span className="col-span-3">{reservaData?.auto?.modelo}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Categoría:</Label>
                    <span className="col-span-3">{reservaData?.fullAutoDTO?.categoria}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Asientos:</Label>
                    <span className="col-span-3">{reservaData?.fullAutoDTO?.cantidadAsientos}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Retiro:</Label>
                    <span className="col-span-3">{reservaData?.fechaEntrega} {reservaData?.horaEntrega}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Devolución:</Label>
                    <span className="col-span-3">{reservaData?.fechaRegreso} {reservaData?.horaRegreso}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Suc. Retiro:</Label>
                    <span className="col-span-3">{getSucursalNameById(reservaData?.sucursalRetiroId ?? 0)}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Suc. Devolución:</Label>
                    <span className="col-span-3">{getSucursalNameById(reservaData?.sucursalEntregaId ?? 0)}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Política Canc.:</Label>
                    <span className="col-span-3">
  Se reintegra {
    reservaData?.auto?.politicaCancelacionPorcentaje !== undefined && reservaData?.auto?.politicaCancelacionPorcentaje !== null
      ? `${(reservaData.auto.politicaCancelacionPorcentaje * 100).toFixed(0)}%` // toFixed(0) para quitar decimales y que no aparezca 0.00%
      : 'N/A'
  }
</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Precio por Día:</Label>
                    <span className="col-span-3">${reservaData?.auto?.precioPorDia}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 font-bold text-lg">
                    <Label className="text-right">Precio Total:</Label>
                    <span className="col-span-3">
                      {loadingPresupuesto ? 'Calculando...' : `$${reservaData?.precioTotal?.toFixed(2) || 'N/A'}`}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleCancelReservation}
              variant="secondary"
              className="mt-4 ml-2"
            >
              Cancelar Reserva
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}