"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

type Auto = {
  idAuto: number;
  marca: string;
  modelo: string;
  cantidadAsientos: number;
  precio: number;
};

function useAutos() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/public/autos")
      .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data: Auto[]) => {
        // Dedupe explícito: sólo la primera aparición de cada idAuto
        const únicos = data.reduce<Auto[]>((acc, curr) => {
          if (!acc.some(a => a.idAuto === curr.idAuto)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        console.log("Autos tras dedupe:", únicos);
        setAutos(únicos);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar autos:", err);
        setError("No se pudo cargar la lista de autos. Intenta nuevamente.");
        setLoading(false);
      });
  }, []);

  return { autos, loading, error };
}

function AutoCard({ auto }: { auto: Auto }) {
  return (
    <div className="border-4 border-amber-900 rounded-xl p-4 shadow-md hover:shadow-lg transition bg-white/90 animate-fadeIn">
      <div className="mb-3 w-full h-[200px] relative rounded overflow-hidden">
        <Image
          src={`/flota-imagenes/${auto.modelo.toLowerCase()}.jpg`}
          alt={`${auto.marca} ${auto.modelo}`}
          fill
          className="object-cover rounded"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h2 className="text-lg font-semibold text-amber-800 mb-1">
        {auto.marca} {auto.modelo}
      </h2>
      <p className="text-gray-800 text-sm">Asientos: {auto.cantidadAsientos}</p>
      <p className="text-gray-800 text-sm">
        Precio por día: ${auto.precio?.toLocaleString("es-AR") ?? "N/A"}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border-4 border-amber-900 rounded-xl p-4 shadow-md bg-white/90 animate-pulse">
      <div className="mb-3 w-full h-40 bg-gray-300 rounded" />
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
      <div className="h-4 bg-gray-300 rounded mb-1 w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
    </div>
  );
}

export default function FlotaPage() {
  const router = useRouter();
  const { autos, loading, error } = useAutos();

  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("precio-asc");
  const [paginaActual, setPaginaActual] = useState(1);
  const autosPorPagina = 6;

  const autosFiltrados = autos.filter(
    (auto) =>
      auto.marca.toLowerCase().includes(filtro.toLowerCase()) ||
      auto.modelo.toLowerCase().includes(filtro.toLowerCase())
  );

  const autosOrdenados = [...autosFiltrados].sort((a, b) => {
    switch (orden) {
      case "precio-asc":
        return a.precio - b.precio;
      case "precio-desc":
        return b.precio - a.precio;
      case "asientos-asc":
        return a.cantidadAsientos - b.cantidadAsientos;
      case "asientos-desc":
        return b.cantidadAsientos - a.cantidadAsientos;
      default:
        return 0;
    }
  });

  const totalPaginas = Math.ceil(autosOrdenados.length / autosPorPagina);
  const indiceInicio = (paginaActual - 1) * autosPorPagina;
  const indiceFin = indiceInicio + autosPorPagina;
  const autosPaginados = autosOrdenados.slice(indiceInicio, indiceFin);

  return (
    <>
      <div className="relative w-full min-h-screen">
        {/* Fondo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/flota-imagenes/fondo.jpg"
            alt="Fondo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-amber-950/40" />
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
          <button
            className="mb-8 px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 transition"
            onClick={() => router.push("/pagina-inicio")}
          >
            ← Volver a Inicio
          </button>

          <div className="flex justify-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-6 py-3 border-4 border-amber-900 rounded-lg bg-amber-950/50 shadow-lg">
              Nuestra Flota
            </h1>
          </div>

          {/* Filtro y orden */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <input
              type="text"
              placeholder="Buscar por marca o modelo..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full max-w-md px-4 py-2 rounded border border-amber-900 bg-white bg-opacity-90 text-amber-900 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <select
              value={orden}
              onChange={(e) => {
                setOrden(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full max-w-md px-4 py-2 rounded border border-amber-900 bg-white bg-opacity-90 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
            >
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="asientos-asc">Asientos: menor a mayor</option>
              <option value="asientos-desc">Asientos: mayor a menor</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
          )}

          {/* Grid de autos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : autosPaginados.length > 0
              ? autosPaginados.map((auto) => (
                  <AutoCard key={auto.idAuto} auto={auto} />
                ))
              : (
                <p className="col-span-full text-center text-white font-semibold">
                  No se encontraron autos para tu búsqueda.
                </p>
              )}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-amber-900 text-white rounded disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="text-white font-semibold">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                }
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-amber-900 text-white rounded disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {/* Animaciones */}
        <style jsx>{`
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {/* Footer al final como en la página de inicio */}
      <Footer />
    </>
  );
}
