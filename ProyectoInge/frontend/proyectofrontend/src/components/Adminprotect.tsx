
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { rol, adminVerificado, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (rol !== "admin" || !adminVerificado)) {
      router.push("/pagina-inicio");
    }
  }, [rol, adminVerificado, loading, router]);

  if (loading || rol !== "admin" || !adminVerificado) {
    return null; // o spinner
  }

  return <>{children}</>;
}
