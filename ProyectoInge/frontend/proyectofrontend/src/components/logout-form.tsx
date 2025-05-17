"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RegistrarCuentaProps {
  className?: string;
}

export  function LogoutForm({ className }: RegistrarCuentaProps) {
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
        headers: {
          "Content-Type": "application/json",
        },
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
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Registrar Cuenta</h1>
            </div>

            <div className="space-y-3">
              <div>
                <Label className= "mb-2" htmlFor="nombre"></Label>
                <Input
                  id="nombre"
                  placeholder="Nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className= "mb-2" htmlFor="apellido"></Label>
                <Input
                  id="apellido"
                  placeholder="Apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className= "mb-2" htmlFor="correo"></Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className= "mb-2" htmlFor="contraseña"></Label>
                <div className="relative">
                  <Input
                    id="contraseña"
                    type={mostrarContraseña ? "text" : "password"}
                    value={formData.contraseña}
                    placeholder="Contraseña"
                    onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContraseña(!mostrarContraseña)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {mostrarContraseña ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label className= "mb-2 text-gray-700 block" htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  placeholder="Fecha de Nacimiento"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dni"></Label>
                <Input
                  id="dni"
                  placeholder="DNI"
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className= "mb-2" htmlFor="telefono"></Label>
                <Input
                  id="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al continuar, aceptas nuestros Términos de servicio y Política de privacidad.
      </div>
            <Button type="submit" className="w-full">
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
