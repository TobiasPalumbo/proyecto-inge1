'use client'
import React, { useState, useEffect, useCallback } from 'react'; // Agregamos useCallback
import { TableHeader, Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface AutoAdminDTO {
    idAuto: number;
    idCategoria: number;
    marca: string;
    modelo: string;
    precio: number;
    cantidadAsientos: number;
    categoria: string;
    idSucursal: number;
    sucursal: string;
    idPoliticaCancelacion: number;
    porcentaje: number;
}

interface PatenteDetail {
    patente: string;
    anio: string;
    borrado: boolean;
    categoria: { id: number; descripcion: string; };
    auto: { idAuto: number; marca: string; modelo: string; cantidadAsientos: number; precioDia: number; borrado: boolean; politicaCancelacion: { idPoliticaCancelacion: number; porcentaje: number; } | null; };
    sucursal: { idSucursal: number; localidad: string; direccion: string; };
    idSucursal: { idSucursal: number; localidad: string; direccion: string; };
}

interface CarDisplayData {
    idAuto: number;
    marca: string;
    modelo: string;
    categoria: string;
    precio: number;
    cantidadAsientos: number;
    politicaCancelacionPorcentaje: number;
    patente: string;
    anio: string;
    sucursalNombre: string;
    sucursalId: number;
}

const MostrarTablaAutos = () => {
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
    const [autoAEliminar, setAutoAEliminar] = useState<CarDisplayData | null>(null);
    const [estaEliminando, setEstaEliminando] = useState(false);

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState<"success" | "error" | "">("");

    const [error, setError] = useState<string>('');
    const [carsToDisplay, setCarsToDisplay] = useState<CarDisplayData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Nueva función para mostrar notificaciones
    const showAndHideNotification = useCallback((message: string, type: "success" | "error") => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
            setNotificationMessage("");
            setNotificationType("");
        }, 3000);
    }, []); // Dependencias vacías, solo se crea una vez

    const fetchCarsData = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8080/admin/autosPatentes', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error HTTP: ${res.status} - ${errorText}`);
            }

            const initialData: { autoAdminDTO: AutoAdminDTO; patentes: string[] }[] = await res.json();

            const allCarPatentesPromises: Promise<CarDisplayData | null>[] = [];

            for (const carGroup of initialData) {
                for (const patente of carGroup.patentes) {
                    allCarPatentesPromises.push(
                        fetch(`http://localhost:8080/admin/autoPatente/${patente}`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                        })
                            .then(detailRes => {
                                if (!detailRes.ok) {
                                    console.error(`Error al cargar detalles para patente ${patente}: ${detailRes.status}`);
                                    return null;
                                }
                                return detailRes.json();
                            })
                            .then((patenteDetail: PatenteDetail) => {
                                return {
                                    idAuto: patenteDetail.auto.idAuto,
                                    marca: patenteDetail.auto.marca,
                                    modelo: patenteDetail.auto.modelo,
                                    categoria: patenteDetail.categoria.descripcion,
                                    precio: patenteDetail.auto.precioDia,
                                    cantidadAsientos: patenteDetail.auto.cantidadAsientos,
                                    politicaCancelacionPorcentaje: patenteDetail.auto.politicaCancelacion?.porcentaje || 0,
                                    patente: patenteDetail.patente,
                                    anio: patenteDetail.anio,
                                    sucursalNombre: patenteDetail.sucursal.localidad,
                                    sucursalId: patenteDetail.sucursal.idSucursal,
                                } as CarDisplayData;
                            })
                            .catch(err => {
                                console.error(`Error procesando patente ${patente}:`, err);
                                return null;
                            })
                    );
                }
            }

            const fetchedCarPatentes = await Promise.all(allCarPatentesPromises);
            const validCars = fetchedCarPatentes.filter((car): car is CarDisplayData => car !== null);

            const sortedData = validCars.sort((a, b) => {
                const marcaA = a.marca.toLowerCase();
                const marcaB = b.marca.toLowerCase();
                if (marcaA < marcaB) return -1;
                if (marcaA > marcaB) return 1;

                const modeloA = a.modelo.toLowerCase();
                const modeloB = b.modelo.toLowerCase();
                if (modeloA < modeloB) return -1;
                if (modeloA > modeloB) return 1;

                const patenteA = a.patente.toLowerCase();
                const patenteB = b.patente.toLowerCase();
                if (patenteA < patenteB) return -1;
                if (patenteA > patenteB) return 1;

                return 0;
            });

            setCarsToDisplay(sortedData);

        } catch (err: any) {
            console.error("Error al obtener los autos:", err);
            setError(err.message);
            setCarsToDisplay([]);
        } finally {
            setLoading(false);
        }
    }, []); // Dependencias vacías, solo se crea una vez

    useEffect(() => {
        fetchCarsData();
    }, [fetchCarsData]); // Se ejecutará cada vez que fetchCarsData cambie, que es solo una vez al montarse

    const handleModifyPatent = (patente: string) => {
        console.log(`Modificar patente: ${patente}`);
        router.push(`/dashboard-admin/flota/modificar/${patente}`);
    };

    const handleAddCar = () => {
        console.log("Navegar a la página para añadir un nuevo auto");
        router.push('/dashboard-admin/flota/subirflota');
    };

    const handleClickEliminar = (auto: CarDisplayData) => {
        setAutoAEliminar(auto);
        setMostrarModalConfirmacion(true);
        // Reseteamos cualquier notificación previa al abrir el modal
        setShowNotification(false);
        setNotificationMessage("");
        setNotificationType("");
    };

    const confirmarEliminacion = async () => {
        if (!autoAEliminar) return;
        setEstaEliminando(true);
        setMostrarModalConfirmacion(false); 

        try {
            const res = await fetch("http://localhost:8080/admin/autoPatente/borrarAutoPatente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ patente: autoAEliminar.patente }),
            });

            const result = await res.json();

            if (!res.ok) {
                showAndHideNotification(result.message || "Ocurrió un error al eliminar el auto.", "error");
                return;
            }

            showAndHideNotification("Auto eliminado correctamente.", "success");
            setCarsToDisplay((prev) =>
                prev.filter((car) => car.patente !== autoAEliminar.patente)
            );
        } catch (err: any) {
            console.error("Error eliminando auto:", err);
            showAndHideNotification("Error al intentar eliminar el auto.", "error");
        } finally {
            setEstaEliminando(false);
            setAutoAEliminar(null);
        }
    };

    const cancelarEliminacion = () => {
        setMostrarModalConfirmacion(false);
        setAutoAEliminar(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-2 p-6 rounded-lg shadow-lg bg-white border border-gray-200">
                    <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg text-gray-700">Cargando datos de autos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50">
                <div className="p-8 rounded-lg shadow-lg bg-white border border-red-300 text-red-700 text-center">
                    <h2 className="text-2xl font-bold mb-4">¡Error al cargar los autos!</h2>
                    <p className="text-lg mb-6">{error}</p>
                    <p className="text-sm text-gray-600">Por favor, verifica la conexión o la consola para más detalles.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
                <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
                    Gestión de Flota de Autos
                </h1>
                <div className="flex justify-end mb-8">
                    <Button
                        onClick={handleAddCar}
                        className="bg-amber-600 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 text-base">
                        + Subir Auto
                    </Button>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white shadow-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-yellow-400/70">
                                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Marca</TableHead>
                                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Modelo</TableHead>
                                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Categoría</TableHead>
                                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Patente</TableHead>
                                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Año</TableHead>
                                <TableHead className="px-4 py-3 text-left text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Sucursal</TableHead>
                                <TableHead className="px-4 py-3 text-right text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Precio por Día
                                </TableHead>
                                <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider">Asientos</TableHead>
                                <TableHead className="px-4 py-3 text-right text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider ">Política Cancelación</TableHead>
                                <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase border-r border-yellow-500 tracking-wider"></TableHead>
                                <TableHead className="px-4 py-3 text-center text-sm font-bold text-amber-950 uppercase tracking-wider"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carsToDisplay.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-24 text-center text-gray-500 text-lg py-9">
                                        No se encontraron autos para mostrar.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                carsToDisplay.map((car) => (
                                    <TableRow key={car.patente} className="border-b border-yellow-300 odd:bg-gray-50">
                                        <TableCell className="px-4 py-3 font-medium text-gray-900 border-r border-yellow-200 ">
                                            {car.marca}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                                            {car.modelo}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                                            {car.categoria}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                                            {car.patente}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                                            {car.anio ? new Date(car.anio).getFullYear() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 border-r border-yellow-200">
                                            {car.sucursalNombre}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right text-gray-800 font-mono border-r border-yellow-200">${car.precio.toFixed(2)}</TableCell>
                                        <TableCell className="px-4 py-3 text-center text-gray-800 border-r border-yellow-200">{car.cantidadAsientos}</TableCell>
                                        <TableCell className="px-4 py-3 text-right text-gray-800 font-mono border-r border-yellow-200">
                                            {(car.politicaCancelacionPorcentaje * 100).toFixed(0)}%
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right text-gray-800 font-mono border-r border-yellow-200">
                                            <Button
                                                onClick={() => handleModifyPatent(car.patente)}
                                                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 text-sm"
                                            >Modificar
                                            </Button>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <Button
                                                onClick={() => handleClickEliminar(car)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-md shadow-lg transition-colors duration-200 text-sm"
                                            >Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {mostrarModalConfirmacion && autoAEliminar && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-amber-950/40 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center border-gray-500 border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
                            <p className="text-gray-700 mb-6">
                                ¿Estás seguro de que deseas eliminar el auto con patente:
                                <br />
                                <span className="font-semibold text-gray-800">{autoAEliminar.patente}</span>?
                            </p>

                            {estaEliminando && (
                                <div className="flex justify-center items-center py-4">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                                    </svg>
                                    Procesando...
                                </div>
                            )}

                            <div className="flex justify-center gap-4">
                                <Button
                                    onClick={cancelarEliminacion}
                                    disabled={estaEliminando}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={confirmarEliminacion}
                                    disabled={estaEliminando}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                                >
                                    {estaEliminando ? "Eliminando..." : "Eliminar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {showNotification && (
                    <div className="fixed inset-0 flex items-center justify-center bg-amber-950/40 bg-opacity-50 z-50 p-4">
                        <div
                            className={`max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3 ${
                                notificationType === "success" ? "border border-green-300" : "border border-red-300"
                            }`}
                        >
                            {notificationType === "success" ? (
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div>
                                <h3 className={`font-semibold text-xl ${notificationType === "success" ? "text-green-700" : "text-red-700"}`}>
                                    {notificationType === "success" ? "¡Éxito!" : "¡Error!"}
                                </h3>
                                <p className="text-md text-gray-700">{notificationMessage}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MostrarTablaAutos;