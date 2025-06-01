'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Info } from 'lucide-react'; 

// --- Interfaces (sin cambios) ---
interface AutoPatenteDetalleDTO {
    patente: string;
    anio: string; // Formato "YYYY-MM-DD"
    borrado: boolean;
    auto: {
        idAuto: number;
        marca: string;
        modelo: string;
        cantidadAsientos: number;
        precioDia: number;
        politicaCancelacion: { idPoliticaCancelacion: number; porcentaje: number; } | null;
    };
    categoria: {
        id: number;
        descripcion: string;
    };
    sucursal: {
        idSucursal: number;
        localidad: string;
        direccion: string;
    };
}

interface MarcaModeloDTO {
    marca: string;
    modelo: string;
}

interface MarcaModeloRequestDTO {
    marca: string;
    modelo: string;
}

interface AutoPatenteModRequestDTO {
    patenteVieja: string;
    patenteNueva: string;
    idSucursal: number;
    marcaModelo: MarcaModeloDTO;
    anio: string;
    idCategoria: number;
    borrado: boolean;
}

interface CategoriaDTO {
    idCategoria: number;
    nombre: string;
}

interface SucursalDTO {
    idSucursal: number;
    localidad: string;
    direccion: string;
}

interface MarcasSucursalesResponseDTO {
    marcas: string[];
    sucursales: SucursalDTO[];
}

const ModificarAutoPatente = () => {
    const router = useRouter();
    const { patente: patenteOriginal } = useParams() as { patente: string };

    const hasInitialDataSetRef = useRef(false);

    const [loading, setLoading] = useState(true); 
    const [initialDataLoading, setInitialDataLoading] = useState(true); 
    const [modelosLoading, setModelosLoading] = useState(false);
    const [categoriasLoading, setCategoriasLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [currentPatenteDetail, setCurrentPatenteDetail] = useState<AutoPatenteDetalleDTO | null>(null);
    
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showNoChangesNotification, setShowNoChangesNotification] = useState(false);

    // Estados del formulario
    const [patenteNueva, setPatenteNueva] = useState('');
    const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>();
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState('');
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>();

    const [marcas, setMarcas] = useState<string[]>([]);
    const [modelos, setModelos] = useState<string[]>([]);
    const [sucursales, setSucursales] = useState<SucursalDTO[]>([]);
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

    const fetchModelos = useCallback(async (currentMarca: string, initialModeloToSet?: string) => {
        if (!currentMarca) {
            setModelos([]);
            setModelo('');
            setCategorias([]);
            setSelectedCategoriaId(undefined);
            return;
        }

        setModelosLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/admin/subirAuto/marca/${encodeURIComponent(currentMarca)}`, {
                credentials: 'include',
            });

            if (!res.ok) {
                console.error(`Error al cargar modelos: ${res.status} - ${await res.text()}`);
                setModelos([]);
                setModelo('');
                setCategorias([]);
                setSelectedCategoriaId(undefined);
                return;
            }

            const data: string[] = await res.json();
            setModelos(data);

            if (initialModeloToSet && data.includes(initialModeloToSet)) {
                setModelo(initialModeloToSet);
            } else if (!data.includes(modelo)) { // Si el modelo actual no está en la nueva lista, resetear
                setModelo('');
                setCategorias([]);
                setSelectedCategoriaId(undefined);
            }
            
        } catch (err: any) {
            console.error('Error al cargar modelos:', err);
            setModelos([]);
            setModelo('');
            setCategorias([]);
            setSelectedCategoriaId(undefined);
        } finally {
            setModelosLoading(false);
        }
    }, [modelo]); 

    const fetchCategorias = useCallback(async (currentMarca: string, currentModelo: string, initialCategoriaIdToSet?: number) => {
        if (!currentMarca || !currentModelo) {
            setCategorias([]);
            setSelectedCategoriaId(undefined);
            return;
        }

        setCategoriasLoading(true);
        try {
            const marcaModeloRequestBody: MarcaModeloRequestDTO = { marca: currentMarca, modelo: currentModelo };
            const categoriasRes = await fetch('http://localhost:8080/admin/subirAuto/bodyAuto', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(marcaModeloRequestBody),
            });

            if (!categoriasRes.ok) {
                console.error(`Error al cargar categorías: ${categoriasRes.status} - ${await categoriasRes.text()}`);
                setCategorias([]);
                setSelectedCategoriaId(undefined);
                return;
            }

            const categoriasMap: { [key: number]: string } = await categoriasRes.json();
            const fetchedCategorias: CategoriaDTO[] = Object.entries(categoriasMap).map(([id, nombre]) => ({
                idCategoria: Number(id),
                nombre: nombre,
            }));
            setCategorias(fetchedCategorias);

            if (initialCategoriaIdToSet !== undefined && fetchedCategorias.some(cat => cat.idCategoria === initialCategoriaIdToSet)) {
                setSelectedCategoriaId(initialCategoriaIdToSet);
            } else if (selectedCategoriaId !== undefined && !fetchedCategorias.some(cat => cat.idCategoria === selectedCategoriaId)) {
                setSelectedCategoriaId(undefined);
            }

        } catch (err: any) {
            console.error("Error al obtener categorías por marca/modelo:", err);
            setCategorias([]);
            setSelectedCategoriaId(undefined);
        } finally {
            setCategoriasLoading(false);
        }
    }, [selectedCategoriaId]);

    
    useEffect(() => {
        if (!patenteOriginal) {
            setError('Patente no proporcionada en la URL.');
            setLoading(false);
            setInitialDataLoading(false);
            return;
        }

        const fetchAllInitialData = async () => {
            setLoading(true);
            setInitialDataLoading(true);
            
            try {
                const [patenteDetailRes, initialResourcesRes] = await Promise.all([
                    fetch(`http://localhost:8080/admin/autoPatente/${patenteOriginal}`, {
                        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                    }),
                    fetch('http://localhost:8080/admin/subirAuto', { credentials: 'include' })
                ]);

                if (!patenteDetailRes.ok) {
                    throw new Error(`Error al cargar detalles de la patente: ${patenteDetailRes.status} - ${await patenteDetailRes.text()}`);
                }
                const fetchedPatenteDetail: AutoPatenteDetalleDTO = await patenteDetailRes.json();
                setCurrentPatenteDetail(fetchedPatenteDetail);

                if (!initialResourcesRes.ok) {
                    throw new Error(`Error al cargar marcas y sucursales: ${initialResourcesRes.status} - ${await initialResourcesRes.text()}`);
                }
                const initialData: MarcasSucursalesResponseDTO = await initialResourcesRes.json();
                setMarcas(initialData.marcas || []);
                setSucursales(initialData.sucursales || []);

                // Setear todos los campos del formulario con los datos iniciales
                setPatenteNueva(fetchedPatenteDetail.patente);
                setSelectedSucursalId(fetchedPatenteDetail.sucursal.idSucursal);
                setAnio(fetchedPatenteDetail.anio.substring(0, 4));
                setMarca(fetchedPatenteDetail.auto.marca);
                setModelo(fetchedPatenteDetail.auto.modelo); // Setear modelo inicial aquí
                setSelectedCategoriaId(fetchedPatenteDetail.categoria.id); // Setear categoría inicial aquí

                hasInitialDataSetRef.current = true; // Indicar que los datos iniciales han sido establecidos

            } catch (err: any) {
                console.error("Error al cargar datos iniciales:", err);
                setError(err.message);
            } finally {
                setInitialDataLoading(false); // Indica que los datos base para el formulario han terminado de cargar
                setLoading(false); // Indica que la carga general de la página ha terminado
            }
        };
        fetchAllInitialData();
    }, [patenteOriginal]);

    
    useEffect(() => {
        if (initialDataLoading) return; 
        
        if (hasInitialDataSetRef.current && currentPatenteDetail && marca === currentPatenteDetail.auto.marca) {
            fetchModelos(marca, currentPatenteDetail.auto.modelo);
        } else {
            fetchModelos(marca);
        }
    }, [marca, initialDataLoading, currentPatenteDetail, fetchModelos]);

    useEffect(() => {
        if (initialDataLoading) return; 
        
        if (hasInitialDataSetRef.current && currentPatenteDetail && 
            marca === currentPatenteDetail.auto.marca && 
            modelo === currentPatenteDetail.auto.modelo) {
            fetchCategorias(marca, modelo, currentPatenteDetail.categoria.id);
            hasInitialDataSetRef.current = false; 
        } else {
            fetchCategorias(marca, modelo);
        }
    }, [marca, modelo, initialDataLoading, currentPatenteDetail, fetchCategorias]);

    const handleMarcaChange = (value: string) => {
        setMarca(value);
      
    };

    const handleModeloChange = (value: string) => {
        setModelo(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos
        setShowNoChangesNotification(false); // Ocultar notificación de "sin cambios" si estaba visible

        if (!patenteOriginal || !patenteNueva || selectedSucursalId === undefined || !marca || !modelo || !anio || selectedCategoriaId === undefined) {
            setError('Por favor, completa todos los campos requeridos.');
            return;
        }
        
    const currentYear = new Date().getFullYear();
    const enteredYear = parseInt(anio, 10);

    if (enteredYear > currentYear) {
        setError(`El año de fabricación no puede ser mayor al año actual (${currentYear}).`);
        return; 
    }

        if (currentPatenteDetail) {
            const anioOriginal = currentPatenteDetail.anio.substring(0, 4);
            const noChangesDetected =
                patenteNueva.toUpperCase() === currentPatenteDetail.patente.toUpperCase() &&
                selectedSucursalId === currentPatenteDetail.sucursal.idSucursal &&
                marca === currentPatenteDetail.auto.marca &&
                modelo === currentPatenteDetail.auto.modelo &&
                anio === anioOriginal &&
                selectedCategoriaId === currentPatenteDetail.categoria.id;

            if (noChangesDetected) {
                setShowNoChangesNotification(true);
                setTimeout(() => setShowNoChangesNotification(false), 3000); 
                return; 
            }
        }

        setLoading(true);

        const requestBody: AutoPatenteModRequestDTO = {
            patenteVieja: patenteOriginal,
            patenteNueva: patenteNueva.toUpperCase(),
            idSucursal: selectedSucursalId,
            marcaModelo: { marca: marca, modelo: modelo },
            anio: `${anio}-02-11`,
            idCategoria: selectedCategoriaId,
            borrado: currentPatenteDetail?.borrado ?? false,
        };

        try {
            const res = await fetch('http://localhost:8080/admin/autoPatente/modificarAuto', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || `Error al modificar el auto: ${res.status} - ${errorText}`);
                } catch {
                    throw new Error(`Error al modificar el auto: ${res.status} - ${errorText}`);
                }
            }
            
            setShowSuccessNotification(true);
            setTimeout(() => {
                router.push('/dashboard-admin/flota');
            }, 2000);
        } catch (err: any) {
            console.error("Error al modificar auto:", err);
            setError(err.message);
        } finally {
            setLoading(false); // Quitar loading después del intento de guardado
        }
    };

    // --- Renderizado Condicional ---
    // Spinner principal: se muestra si loading es true Y initialDataLoading es true
    // Esto asegura que el spinner grande solo aparezca durante la carga inicial de la página.
    if (loading && initialDataLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-2 p-6 rounded-lg shadow-lg bg-white border border-gray-200">
                    <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg text-gray-700">Cargando datos del auto...</p>
                </div>
            </div>
        );
    }

    // Mensaje de error general
    if (error && !showNoChangesNotification) { // No mostrar error si la notificación de "sin cambios" está activa
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-red-700 text-center max-w-md w-full border border-red-300">
                    <h2 className="text-2xl font-bold mb-4">¡Error!</h2>
                    <p className="text-lg mb-6">{error}</p>
                    <Button onClick={() => { setError(null); if (!currentPatenteDetail && !initialDataLoading) router.back(); }} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">Cerrar</Button>
                </div>
            </div>
        );
    }

    // Si no se encontraron datos del auto y la carga inicial ya terminó
    if (!currentPatenteDetail && !initialDataLoading && !loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-amber-300">
                    <h2 className="text-2xl font-bold mb-4 text-amber-700">Atención</h2>
                    <p className="text-lg text-gray-700 mb-6">No se encontraron datos para la patente especificada o hubo un error al cargarlos.</p>
                    <Button onClick={() => router.back()} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">Volver</Button>
                </div>
            </div>
        );
    }
    
    const isSubmitting = loading && !initialDataLoading;


    return (
        <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
                Modificar Auto: <span className="text-amber-600">{patenteOriginal}</span>
            </h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-amber-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="patenteNueva" className="text-gray-700 mb-1 block">Nueva Patente</Label>
                        <Input
                            id="patenteNueva"
                            value={patenteNueva}
                            onChange={(e) => setPatenteNueva(e.target.value.toUpperCase())}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="marca" className="text-gray-700 mb-1 block">Marca</Label>
                        <Select
                            onValueChange={handleMarcaChange}
                            value={marca}
                            disabled={initialDataLoading || marcas.length === 0}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder={initialDataLoading ? "Cargando..." : "Selecciona una marca"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {marcas.length === 0 && !initialDataLoading ? (
                                        <SelectItem value="no-brands" disabled>No hay marcas disponibles.</SelectItem>
                                    ) : (
                                        marcas.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="modelo" className="text-gray-700 mb-1 block">Modelo</Label>
                        <Select
                            onValueChange={handleModeloChange}
                            value={modelo}
                            disabled={!marca || modelosLoading || modelos.length === 0}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder={
                                        !marca ? "Selecciona una marca primero" :
                                        modelosLoading ? "Cargando modelos..." :
                                        (modelos.length ? "Selecciona un modelo" : "No hay modelos para esta marca")
                                    } />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {modelos.length === 0 && marca && !modelosLoading ? (
                                        <SelectItem value="no-models" disabled>No hay modelos disponibles.</SelectItem>
                                    ) : (
                                        modelos.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="anio" className="text-gray-700 mb-1 block">Año de Fabricación</Label>
                        <Input
                            id="anio"
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={anio}
                            onChange={(e) => setAnio(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="categoria" className="text-gray-700 mb-1 block">Categoría</Label>
                        <Select
                            onValueChange={(value) => setSelectedCategoriaId(Number(value))}
                            value={selectedCategoriaId !== undefined ? selectedCategoriaId.toString() : ''}
                            disabled={!marca || !modelo || categoriasLoading || categorias.length === 0}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder={
                                        (!marca || !modelo) ? "Selecciona marca y modelo" :
                                        categoriasLoading ? "Cargando categorías..." :
                                        (categorias.length ? "Selecciona una categoría" : "No hay categorías disponibles")
                                    } />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {categorias.length === 0 && marca && modelo && !categoriasLoading ? (
                                        <SelectItem value="no-categories" disabled>No hay categorías disponibles.</SelectItem>
                                    ) : (
                                        categorias.map((cat) => (
                                            <SelectItem key={cat.idCategoria} value={cat.idCategoria.toString()}>
                                                {cat.nombre}
                                            </SelectItem>
                                        ))
                                    )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="sucursal" className="text-gray-700 mb-1 block">Sucursal</Label>
                    <Select
                        onValueChange={(value) => setSelectedSucursalId(Number(value))}
                        value={selectedSucursalId !== undefined ? selectedSucursalId.toString() : ''}
                        disabled={initialDataLoading || sucursales.length === 0}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder={initialDataLoading ? "Cargando..." : "Selecciona una sucursal"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {sucursales.length === 0 && !initialDataLoading ? (
                                    <SelectItem value="no-branches" disabled>No hay sucursales disponibles.</SelectItem>
                                ) : (
                                    sucursales.map((suc) => (
                                        <SelectItem key={suc.idSucursal} value={suc.idSucursal.toString()}>
                                            {suc.localidad} - {suc.direccion}
                                        </SelectItem>
                                    ))
                                )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        onClick={() => router.push('/dashboard-admin/flota')}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-amber-600 hover:bg-amber-800 text-white font-semibold px-8 py-3 transition-colors duration-200"
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>

            {/* Notificación de Éxito */}
            {showSuccessNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-amber-950/40 bg-opacity-50 z-50 p-4">
                    <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3 border border-green-300">
                        <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-xl text-green-700">¡Éxito!</h3>
                            <p className="text-md text-gray-700">Auto modificado correctamente. Redirigiendo...</p>
                        </div>
                    </div>
                </div>
            )}

            {showNoChangesNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-amber-950/40 bg-opacity-50 z-50 p-4">
                    <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3 border border-blue-300">
                        <Info className="w-8 h-8 text-amber-800 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-xl text-amber-800">Información</h3>
                            <p className="text-md text-gray-700">No se detectaron modificaciones en los datos del auto.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModificarAutoPatente;