"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardEmpleado()
{    
      const { rol, loading } = useAuth();
      const router = useRouter();
    
    
      useEffect(() => {
        if (!loading) {
          if (rol !== "empleado") {
            router.push("/pagina-inicio"); 
          }
        }
        }, [rol, loading, router]);
    
    
        if (loading || rol !== "empleado") {
        return null;
      }
    
    return (
        <div> 
          <h1>Bienvenido al panel de empleados de Alquilapp Car</h1>
        </div>
    );
}