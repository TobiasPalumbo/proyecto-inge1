"use client";
import NavBar from "@/components/NavBar";
import { FormBuscarAuto } from "@/components/FormBuscarAuto";
import Footer from "@/components/Footer";
import Image from "next/image";
import SobreNosotros from "@/components/SobreNosotros";
import Link from "next/link";

export default function PaginaInicio() {
    return(
        <>
            <NavBar/>
            <div className="relative w-full h-[550px] overflow-hidden"> 
                <div className="absolute inset-0 bg-cover bg-center">
                    <Image 
                        src="/fondoinicio.jpg" 
                        alt="Fondo de auto" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-amber-950/30"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <h1 className="text-5xl font-bold mb-9 drop-shadow-lg text-center">
                        Manejá Tu Camino con Alquilapp Car
                    </h1>
                    <div className="mt-3"><FormBuscarAuto /></div>
                </div>
            </div>
            
            {/* Botón de WhatsApp */}
            <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                <Link 
                    href="https://wa.me/5491132694362" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all flex items-center justify-center"
                    aria-label="Contactar por WhatsApp"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-8 h-8"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                </Link>
            </div>

            <SobreNosotros />
            <div className="py-12 px-4 max-w-7xl mx-auto"></div>
            <Footer/>
        </>
    )   
}