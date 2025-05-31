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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface RegistrarCuentaProps {
  className?: string;
}

export function SignUpForm({ className }: RegistrarCuentaProps) {
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registroExitoso, setRegistroExitoso] = useState(false);
 
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: { [key: string]: string } = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!formData.correo.trim()) nuevosErrores.correo = "El correo electrónico es obligatorio.";
    if (!formData.contraseña.trim()) nuevosErrores.contraseña = "La contraseña es obligatoria.";
    if (!formData.fechaNac.trim()) nuevosErrores.fechaNac = "La fecha de nacimiento es obligatoria.";
    if (!formData.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio.";
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";

    if (formData.contraseña && formData.contraseña.length < 4) {
      nuevosErrores.contraseña = "Debe tener al menos 4 caracteres.";
    }

    if (formData.telefono && !/^\d{8,15}$/.test(formData.telefono)) {
      nuevosErrores.telefono = "Debe tener entre 8 y 15 dígitos numéricos.";
    }

    if (formData.dni && !/^\d{7,9}$/.test(formData.dni)) {
      nuevosErrores.dni = "Debe tener entre 7 y 9 dígitos numéricos.";
    }

    if (formData.fechaNac) {
      const fechaNac = new Date(formData.fechaNac);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      const dia = hoy.getDate() - fechaNac.getDate();

      if (fechaNac > hoy) {
        nuevosErrores.fechaNac = "La fecha no puede ser futura.";
      } else if (edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)))) {
        nuevosErrores.fechaNac = "Debes ser mayor de edad.";
      }
    }

    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      const response = await fetch("http://localhost:8080/public/registrarse", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistroExitoso(true);

        setTimeout(async () => {
          try {
            await login(formData.correo, "cliente");
            router.push("/pagina-inicio");
          } catch (loginError) {
            console.error("Error en login:", loginError);
            setErrors({ general: "Error al iniciar sesión luego del registro." });
            setRegistroExitoso(false);
          }
        }, 2500);
      } else {
        setErrors({ general: data.message || "Registro fallido" });
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      setErrors({ general: "Ocurrió un error en el registro." });
    }
  };

  return (
    <div className={cn("flex justify-center py-10 relative", className)}>
      <Card className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
        <CardContent className="grid p-6 h-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Registrar Cuenta</h1>
            </div>

            <div className="space-y-3">
              <Label htmlFor="nombre">Nombre<span className="text-red-600">*</span></Label>
              <Input
                id="nombre"
                type="text"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}

              <Label htmlFor="apellido">Apellido<span className="text-red-600">*</span></Label>
              <Input
                id="apellido"
                type="text"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
              {errors.apellido && <p className="text-sm text-red-600">{errors.apellido}</p>}

              <Label htmlFor="correo">Correo Electrónico<span className="text-red-600">*</span></Label>
              <Input
                id="correo"
                type="email"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
              {errors.correo && <p className="text-sm text-red-600">{errors.correo}</p>}

              <Label htmlFor="contraseña">Contraseña<span className="text-red-600">*</span></Label>
              <div className="relative">
                <Input
                  id="contraseña"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                  type={mostrarContraseña ? "text" : "password"}
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
              {errors.contraseña && <p className="text-sm text-red-600">{errors.contraseña}</p>}

              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento<span className="text-red-600">*</span></Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNac}
                onChange={(e) => setFormData({ ...formData, fechaNac: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                required/>
              {errors.fechaNac && <p className="text-sm text-red-600">{errors.fechaNac}</p>}

              <Label htmlFor="dni">DNI<span className="text-red-600">*</span></Label>
              <Input
                id="dni"
                type="text"
                value={formData.dni}
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                required
              />
              {errors.dni && <p className="text-sm text-red-600">{errors.dni}</p>}

              <Label htmlFor="telefono">Teléfono<span className="text-red-600">*</span></Label>
              <Input
                id="telefono"
                type="tel"
                className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
              {errors.telefono && <p className="text-sm text-red-600">{errors.telefono}</p>}
            </div>

            {errors.general && (
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            )}

            <Button type="submit" className="w-full bg-amber-900 hover:bg-amber-800 text-white">
              Registrarte
            </Button>

            <p className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/logIn" className="underline">
                Inicia Sesión
              </Link>
            </p>

            <div className="text-center text-xs text-muted-foreground">
              Al continuar, aceptas nuestros Términos de servicio y Política de privacidad.
            </div>
          </form>
        </CardContent>
      </Card>

      {registroExitoso && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Alert className="max-w-sm">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <AlertTitle>¡Registro exitoso!</AlertTitle>
            <AlertDescription>Serás redirigido a la página de inicio.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
