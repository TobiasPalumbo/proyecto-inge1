"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Sucursal = {
  idSucursal: number;
  localidad: string;
  direccion: string;
};

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch("http://localhost:8080/public/sucursales", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar sucursales");
        const data = await res.json();
        setSucursales(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSucursales();
  }, []);

  const normalizeImageName = (localidad: string) => {
    return localidad
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');
  };

  const filteredSucursales = sucursales.filter(sucursal =>
    sucursal.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <p className="text-amber-900 text-xl animate-pulse">Cargando sucursales...</p>
      </div>
    );
  }

  return (
    <div className="fondo">
    <div className=" bg-amber-10  ">
      <main className="container mx-auto px-4 py-8 xl:px-8 2xl:max-w-7xl ">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Nuestras Sucursales
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <input
              type="text"
              placeholder="🔍 Buscar sucursal..."
              className="px-4 py-2 border border-amber-300 rounded-lg w-full lg:w-72 xl:w-80 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link 
              href="/"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-center transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
            >
              Volver
            </Link>
          </div>
        </div>

        {/* Results */}
        {filteredSucursales.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-amber-800 mb-4">No se encontraron sucursales</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-amber-600 hover:text-amber-800 underline text-lg"
              >
                Mostrar todas
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredSucursales.map((sucursal) => (
              <CardSucursal 
                key={sucursal.idSucursal}
                sucursal={sucursal}
                imageName={normalizeImageName(sucursal.localidad)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
    </div>
  );
}

function CardSucursal({ sucursal, imageName }: { sucursal: Sucursal, imageName: string }) {
  return (
    <div className="border-2 border-amber-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white h-full flex flex-col hover:border-amber-300">
      <div className="h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 relative">
        <Image
          src={`/sucursales-imagenes/${imageName}.jpg`}
          alt={`Sucursal ${sucursal.localidad}`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/sucursales-imagenes/default.jpg';
          }}
        />
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg md:text-xl font-semibold text-amber-800 line-clamp-2">
            {sucursal.localidad}
          </h3>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
            #{sucursal.idSucursal}
          </span>
        </div>
        <p className="mt-2 text-gray-700 text-sm md:text-base line-clamp-3">
          {sucursal.direccion}
        </p>
      </div>
    </div>
  );
}