"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { useEffect } from "react";

interface RegistrarCuentaProps {
  className?: string;
}

export function SignUpForm({ className }: RegistrarCuentaProps) {
  const [error, setError] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    fechaNac: "",
    dni: "",
    telefono: "",
  });
  const { correo } = useAuth();
  const {login} = useAuth();
  const { loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.fechaNac) > new Date()) {
    setError("La fecha de nacimiento no puede ser futura.");
    return;
    }

    if (formData.contraseña.length < 4) {
    setError("La contraseña debe tener al menos 4 caracteres.");
    return;
    }

    if (!/^\d{8,15}$/.test(formData.telefono)) {
    setError("El teléfono debe contener entre 8 y 15 dígitos numéricos.");
    return;
    }

    if (!/^\d{7,9}$/.test(formData.dni)) {
      setError("El DNI debe contener entre 7 y 9 dígitos numéricos.");
    return;
    }

    setError(""); // Limpiar errores si todo está OK
    
    try {
      const response = await fetch("http://localhost:8080/registrarse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        try {
        login(formData.correo, "cliente"); // 👈 Si esto falla, se corta todo
    } catch (loginError) {
        console.error("Error en login después de registrarse:", loginError);
        setError("Error al iniciar sesión luego del registro.");
    }
  } else {
    setError(data.message || "Registro fallido");
  }
} catch (err) {
  console.error("Error en fetch:", err);
  setError("Ocurrió un error en el registro.");
}
  };


useEffect(() => {
  if (!loading && correo) {
    router.push("/pagina-inicio");
  }
  }, [correo, loading]);


  

  return (
    <div className={cn("flex justify-center py-10", className)}>
      <Card className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
        <CardContent className="grid  p-6 h-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Registrar Cuenta</h1>
            </div>

            <div className="space-y-3">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />

              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                type="text"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
              <Label htmlFor="contraseña">Contraseña</Label>  
              <div className="relative">
                <Input
                  id="contraseña"
                  type={mostrarContraseña ? "text" : "password"}
                  className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                  value={formData.contraseña}
                  onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                  required
                />
                <button
                  type="button"
                  aria-label={mostrarContraseña ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setMostrarContraseña(!mostrarContraseña)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {mostrarContraseña ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div>
                <Label className="mb-2" htmlFor="fechaNacimiento">
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                  value={formData.fechaNac}
                  onChange={(e) => setFormData({ ...formData, fechaNac: e.target.value })}
                  required
                />
              </div>
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                type="text"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                required
              />
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>

<div className="text-center text-xs text-muted-foreground">
  Al continuar, aceptas nuestros Términos de servicio y Política de privacidad.
</div>

            <Button type="submit" className="w-full bg-amber-900 hover:bg-amber-800 text-white">
              Registrarte
            </Button>

            {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}

            <p className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/logIn" className="underline">
                Inicia Sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
