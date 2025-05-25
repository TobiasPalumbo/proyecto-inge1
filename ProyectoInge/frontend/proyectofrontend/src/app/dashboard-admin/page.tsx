"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
    const { rol, loading, adminVerificado } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading) {
      if (rol !== "admin" || !adminVerificado) {
        router.push("/pagina-inicio"); // o "/login"
      }
    }
    }, [rol, loading, adminVerificado, router]);


    if (loading || rol !== "admin"|| !adminVerificado) {
    return null; // o un spinner si querés
  }

  return (
    <div>
      <h1>Dashboard Admin - Acceso autorizado</h1>
      {/* Contenido exclusivo para admin verificado */}
    </div>
  );
}
