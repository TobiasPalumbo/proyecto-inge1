"use client";
import NavBar from "@/components/NavBar";
import { FormBuscarAuto } from "@/components/FormBuscarAuto";
import Footer from "@/components/Footer";
import Image  from "next/image";

export default function PaginaInicio() {
    return(
        <>
        <NavBar/>
        <div className="relative w-full h-[600px] overflow-hidden"> 
            <div className="absolute inset-0 bg-cover bg-center">
                <Image src="/fondoinicio.jpg" alt="Fondo de auto" fill //imagen ocupe todo el espacio del padre
                className="object-cover" // Asegura que la imagen cubra el área sin distorsionarse
                priority
                />
                <div className="absolute inset-0 bg-amber-950/20"></div> {/* Ajusta el color y la opacidad aquí */}
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <h1 className="text-5xl font-bold mb-8 drop-shadow-lg text-center">
                    Manejá Tu Camino con Alquiapp Car
                </h1>
                <div className="mt-10"> <FormBuscarAuto /> </div>

            </div>
        </div>
        <div className="py-12 px-4 max-w-7xl mx-auto">

        </div>
        <Footer/>
        </>
    )
    
}