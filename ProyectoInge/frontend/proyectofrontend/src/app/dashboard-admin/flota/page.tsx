'use client'
import React, { useState, useEffect } from 'react'
import { TableHeader, Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
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
    anio: string; // El año viene aquí
    borrado: boolean;
    categoria: { id: number; descripcion: string; }; // Para asegurar consistencia si se usa
    auto: { idAuto: number; marca: string; modelo: string; cantidadAsientos: number; precioDia: number; borrado: boolean; politicaCancelacion: { idPoliticaCancelacion: number; porcentaje: number; } | null; };
    sucursal: { idSucursal: number; localidad: string; direccion: string; }; // La sucursal real de esta patente
    idSucursal: { idSucursal: number; localidad: string; direccion: string; }; // Redundante, pero en la API
}

interface CarDisplayData {
    idAuto: number;
    marca: string;
    modelo: string;
    categoria: string;
    precio: number;
    cantidadAsientos: number;
    politicaCancelacionPorcentaje: number;
    patente: string; // Patente individual
    anio: string;    // Año de esa patente
    sucursalNombre: string; // Nombre de la sucursal de esa patente
    sucursalId: number; // ID de la sucursal de esa patente
}

const MostrarTablaAutos = () => {
  const [error, setError] = useState<string>('');
  const [carsToDisplay, setCarsToDisplay] = useState<CarDisplayData[]>([]); // Usaremos esta para la tabla
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchCarsData = async () => {
      setLoading(true); 
      setError(''); 

      try {
        // Paso 1: Obtener la lista general de autos y patentes
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

        // Paso 2: Para cada patente, hacer una llamada individual para obtener sus detalles
        for (const carGroup of initialData) {
            for (const patente of carGroup.patentes) {
                allCarPatentesPromises.push(
                    fetch(`http://localhost:8080/admin/autoPatente/${patente}`, { // URL de la API de detalle por patente
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then(detailRes => {
                        if (!detailRes.ok) {
                            console.error(`Error al cargar detalles para patente ${patente}: ${detailRes.status}`);
                            return null; // Retorna null si hay error para esa patente específica
                        }
                        return detailRes.json();
                    })
                    .then((patenteDetail: PatenteDetail) => {
                          return {
                            idAuto: patenteDetail.auto.idAuto,
                            marca: patenteDetail.auto.marca,
                            modelo: patenteDetail.auto.modelo,
                            categoria: patenteDetail.categoria.descripcion, // Usamos la descripción de la categoría
                            precio: patenteDetail.auto.precioDia,
                            cantidadAsientos: patenteDetail.auto.cantidadAsientos,
                            politicaCancelacionPorcentaje: patenteDetail.auto.politicaCancelacion?.porcentaje || 0, // Manejo de null
                            patente: patenteDetail.patente,
                            anio: patenteDetail.anio,
                            sucursalNombre: patenteDetail.sucursal.localidad, // Nombre de la sucursal de la patente
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
    };

    fetchCarsData();
  }, []);

  const handleModifyPatent = (patente: string) => { 
    console.log(`Modificar patente: ${patente}`);
    router.push(`/dashboard-admin/flota/modificar/${patente}`);
  };

  const handleAddCar = () => {
    console.log("Navegar a la página para añadir un nuevo auto");
    router.push('/dashboard-admin/flota/subirflota'); 
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
                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      onClick={() => handleModifyPatent(car.patente)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 text-sm"
                    >Modificar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MostrarTablaAutos;