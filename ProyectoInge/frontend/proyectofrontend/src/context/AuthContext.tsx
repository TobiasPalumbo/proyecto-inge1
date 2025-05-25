"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  correo: string | null;
  rol: string | null;
  adminVerificado: boolean;
  login: (correo: string, rol: string, adminVerificado?: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [correo, setCorreo] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [adminVerificado, setAdminVerificado] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, cargamos sesión desde sessionStorage
    const storedCorreo = sessionStorage.getItem("correo");
    const storedRol = sessionStorage.getItem("rol");
    const storedVerificado = sessionStorage.getItem("adminVerificado");

    if (storedCorreo && storedRol) {
      setCorreo(storedCorreo);
      setRol(storedRol);
      setAdminVerificado(storedVerificado === "true");
    }
    setLoading(false);
  }, []);

  const login = (correo: string, rol: string ,adminVerificado= false) => {
    sessionStorage.setItem("correo", correo);
    sessionStorage.setItem("rol", rol);
    sessionStorage.setItem("adminVerificado", String(adminVerificado));
    setCorreo(correo);
    setRol(rol);
    setAdminVerificado(adminVerificado);
  };

  const logout = () => {
    sessionStorage.removeItem("correo");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("adminVerificado")
    setCorreo(null);
    setRol(null);
    setAdminVerificado(false);
  };

  return (
    <AuthContext.Provider value={{ correo, rol,adminVerificado, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar más fácil el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
