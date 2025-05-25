"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EmpleadoGuard({ children }: { children: React.ReactNode }) {
  const { rol, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (rol !== "empleado")) {
      router.push("/pagina-inicio");
    }
  }, [rol, loading, router]);

  if (loading || rol !== "empleado" ) {
    return null; // o spinner
  }

  return <>{children}</>;
}
