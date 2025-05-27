"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardEmpleado()
{    
      const { rol, loading } = useAuth();
      const router = useRouter();
    
    
      useEffect(() => {
        if (!loading) {
          if (rol !== "empleado") {
            router.push("/pagina-inicio"); // o "/login"
          }
        }
        }, [rol, loading, router]);
    
    
        if (loading || rol !== "empleado") {
        return null; // o un spinner si querés
      }
    
    return (
        <div>Hola empleado</div>
    );
}