"use client"

import VerificacionCodigo from "../../../components/verificacion-admin";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // si usás App Router
// import { useRouter } from "next/router"; // si usás Pages Router
import { useAuth } from "@/context/AuthContext";// adaptá el path a donde esté tu provider


export default function VerificacionAdminPage() {

  const { rol, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading) {
      if (rol !== "admin") {
        router.push("/pagina-inicio"); // o "/login"
      }
    }
    }, [rol, loading, router]);


    if (loading || rol !== "admin") {
    return null; // o un spinner si querés
  }

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <VerificacionCodigo />
      </div>
    </div>
  );
}