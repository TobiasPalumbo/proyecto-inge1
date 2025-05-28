"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FlotaDisponiblePage() {
  const searchParams = useSearchParams();

  // Leer parámetros
  const sucursalRetiro = searchParams.get("sucursalRetiro") || "";
  const sucursalDevolucion = searchParams.get("sucursalDevolucion") || "";
  const fechaRetiro = searchParams.get("fechaRetiro") || "";
  const fechaDevolucion = searchParams.get("fechaDevolucion") || "";
  const horaRetiro = searchParams.get("horaRetiro") || "";
  const horaDevolucion = searchParams.get("horaDevolucion") || "";

  const [flotaFiltrada, setFlotaFiltrada] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlota() {
      setLoading(true);
      // Aquí podés llamar a la API para filtrar autos disponibles con los parámetros:
      const query = new URLSearchParams({
        sucursalRetiro,
        sucursalDevolucion,
        fechaRetiro,
        fechaDevolucion,
        horaRetiro,
        horaDevolucion,
      });

      try {
        const res = await fetch(`http://localhost:8080/public/flota-disponible?${query.toString()}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Error al obtener la flota disponible");
        }
        const data = await res.json();
        setFlotaFiltrada(data);
      } catch (error) {
        console.error(error);
        setFlotaFiltrada([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFlota();
  }, [sucursalRetiro, sucursalDevolucion, fechaRetiro, fechaDevolucion, horaRetiro, horaDevolucion]);

  if (loading) return <p>Cargando autos disponibles...</p>;

  if (flotaFiltrada.length === 0) return <p>No hay autos disponibles para ese filtro.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Autos disponibles</h1>
      <ul>
        {flotaFiltrada.map((auto) => (
          <li key={auto.id} className="mb-2 border p-4 rounded shadow">
            <p><strong>Marca y modelo:</strong> {auto.marca} {auto.modelo}</p>
            <p><strong>Precio por día:</strong> ${auto.precioPorDia}</p>
            {/* Mostrá más detalles como quieras */}
          </li>
        ))}
      </ul>
    </div>
  );
}
