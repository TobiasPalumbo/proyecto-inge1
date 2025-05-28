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
import { useAuth } from "@/context/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [error, setError] = useState("")
    const [mostrarContraseña, setMostrarContraseña] = useState(false);

    const router = useRouter()
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(""); // Limpiar cualquier error previo al intentar enviar el formulario

        try {
            const response = await fetch("http://localhost:8080/public/autenticacion/login", { 
            method: "POST",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo: correo.toLowerCase().trim(), contraseña: contraseña.trim() }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            login(data.correo, data.rol)

            if (data.rol === "cliente" || data.rol === "empleado") {
                router.push("/pagina-inicio");
            } else if (data.rol === "admin") {
                router.push("/logIn/admin-verificacion");
            } 
        }
        else {
            setError(data.message || "Error de autenticación");
        }
        }catch (caughtError: any) {
            setError(caughtError.message || "Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
        }
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-lg overflow-hidden bg-white border border-gray-300 rounded-lg shadow-md">
        <CardContent className="grid  p-0 h-full">
          <form onSubmit={handleSubmit} className="flex flex-col justify-center p-6 md:p-8">
            {/* Aquí ajustamos el gap para reducir la separación entre los campos */}
            <div className="flex flex-col gap-4"> {/* Cambiado de gap-6 a gap-4 */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold pb-6 pt-4">Iniciar Sesion</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electronico<span className="text-red-600">*</span></Label>
                <Input
                  id="email"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-100"
                  type="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contraseña">Contraseña<span className="text-red-600">*</span></Label>
                <div className="relative">
                  <Input 
                    id="contraseña" 
                    type={mostrarContraseña ? "text" : "password"} 
                    className="focus:outline-none focus:ring-2 focus:ring-gray-100 "
                    value={contraseña}
                    onChange={(e) => {
                      setContraseña(e.target.value);
                      if (error) setError("");
                    }}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContraseña(!mostrarContraseña)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"> 
                    {mostrarContraseña ?  <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full  bg-amber-900 hover:bg-amber-800 text-white">
                Iniciar Sesión
              </Button>
              {error && (
                <div className="text-red-600 text-sm mt-2 text-center">{error}</div>
              )}
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
