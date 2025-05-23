"use client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [error, setError] = useState("")
    const [mostrarContraseña, setMostrarContraseña] = useState(false);

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:8080/autenticacion/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo, contraseña }),
    });

    const data = await response.json();

        if (response.ok) {
            localStorage.setItem("correo", data.correo);
            localStorage.setItem("rol", data.rol);

            if (data.rol === "cliente" || data.rol === "empleado") {
                router.push("/pagina-inicio"); // Ruta para cliente o empleado
            } else if (data.rol === "admin") {
                router.push("/logIn/admin-verificacion");
        // manejar éxito, guardar token, redireccionar, etc.
        } 
        }
        else {
            setError(data.message || "Error de autenticación");
        }
        }catch (error) {
            setError("Usuario o contraseña incorrectos");
        }
    }



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-lg overflow-hidden bg-white border border-gray-300 rounded-lg shadow-md">
        <CardContent className="grid  p-0 h-full">
          <form onSubmit={handleSubmit} className="flex flex-col justify-center p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold pb-6 pt-4">Iniciar Sesion</h1>
              </div>
              <div className="grid gap-2">
                <Input
                  id="email"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                  type="email"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                <Input 
                    id="contraseña" 
                    type={mostrarContraseña ? "text" : "password"} 
                    placeholder="Contraseña"
                    className="focus:outline-none focus:ring-2 focus:ring-gray-100 border-gray-300"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                required />
                <button
                  type="button"
                  onClick={() => setMostrarContraseña(!mostrarContraseña)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {mostrarContraseña ?  <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              </div>
              <Button type="submit" className="w-full  bg-amber-900 hover:bg-amber-800 text-white">
                Iniciar Sesión
              </Button>
              {error && (
                <div className="text-red-600 text-sm mt-2 text-center">{error}</div>
              )}
              
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              </div>
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/logIn/registrarCuenta" className="underline underline-offset-4">
                  Regístrate
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
    </div>
  )
}
