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
    fechaNacimiento: "",
    dni: "",
    telefono: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/registrarcuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("correo", formData.correo);
        localStorage.setItem("rol", "cliente");
        router.push("/");
      } else {
        setError(data.message || "Registro fallido");
      }
    } catch {
      setError("Usuario existente");
    }
  };

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
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
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
