"use client";
import NavBar from "@/components/NavBar";
import { FormBuscarAuto } from "@/components/FormBuscarAuto";
import Footer from "@/components/Footer";
import Image  from "next/image";
import SobreNosotros from "@/components/SobreNosotros";

export default function PaginaInicio() {
    return(
        <>
        <NavBar/>
        <div className="relative w-full h-[550px] overflow-hidden"> 
            <div className="absolute inset-0 bg-cover bg-center">
                <Image src="/fondoinicio.jpg" alt="Fondo de auto" fill 
                className="object-cover" // Asegura que la imagen cubra el área sin distorsionarse
                priority
                />
                <div className="absolute inset-0 bg-amber-950/30"></div> {/* Ajusta el color y la opacidad aquí */}
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <h1 className="text-5xl font-bold mb-9 drop-shadow-lg text-center">
                    Manejá Tu Camino con Alquilapp Car
                </h1>
                <div className="mt-3"> <FormBuscarAuto /> </div>

            </div>
        </div>
        <SobreNosotros />
        <div className="py-12 px-4 max-w-7xl mx-auto">

        </div>
        <Footer/>
        </>
    )
    
}