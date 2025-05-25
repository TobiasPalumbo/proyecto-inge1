"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  correo: string | null;
  rol: string | null;
  login: (correo: string, rol: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [correo, setCorreo] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, cargamos sesión desde sessionStorage
    const storedCorreo = sessionStorage.getItem("correo");
    const storedRol = sessionStorage.getItem("rol");
    if (storedCorreo && storedRol) {
      setCorreo(storedCorreo);
      setRol(storedRol);
    }
    setLoading(false);
  }, []);

  const login = (correo: string, rol: string) => {
    sessionStorage.setItem("correo", correo);
    sessionStorage.setItem("rol", rol);
    setCorreo(correo);
    setRol(rol);
  };

  const logout = () => {
    sessionStorage.removeItem("correo");
    sessionStorage.removeItem("rol");
    setCorreo(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ correo, rol, login, logout, loading }}>
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
