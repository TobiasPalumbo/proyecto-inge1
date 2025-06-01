"use client"
import { LoginForm } from "../../components/login-form"
import { useRouter } from "next/navigation";
export default function LoginPage() {
   const router = useRouter();
    return (
      <>
    <button
      className="fixed top-4 left-4 z-50 mb-8 px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 transition" // Modificado
      onClick={() => router.push("/pagina-inicio")}
    >
      ← Volver a Inicio
    </button>
     
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-yellow-600/75 bg.transparent-50">
      <div className="w-full max-w-sm">
 
        <LoginForm />
      </div>
    </div>
    </>
    )
    
}