"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from './ui/card';
import Image from 'next/image';

export default function VerificacionCodigo() {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { correo, login } = useAuth();
  const router = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => { 
    e.preventDefault(); 

    if (!correo) {
      setMensaje("Correo no disponible. Iniciá sesión nuevamente.");
      return;
    }

    const codigoLimpio = codigo.trim();
    console.log("Enviando verificación con:", { codigo: codigoLimpio, correo });

    try {
      const res = await fetch('http://localhost:8080/public/autenticacion/verif-admin', { 
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: codigoLimpio, correo }),
      });

      if (res.ok) {
        console.log("Código verificado correctamente.");
        login(correo, "admin", true);
        router.push("/pagina-inicio");
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.message || data.mensaje || "Código incorrecto o expirado.";
        setMensaje(`Error: ${errorMsg}`);
        console.warn("Código incorrecto. Backend respondió:", data);
      }
    } catch (err) {
      console.error("Error en la solicitud de verificación:", err);
      setMensaje('Error de conexión. Intenta nuevamente.');
    }
  };

  return (
    <Card className='bg-white border border-gray-300'>
      <Image src="/logo.png" alt="logo" width={160} height={150} className='mx-auto'/>

      <form onSubmit={manejarEnvio} className="flex flex-col gap-4 max-w-md mx-auto p-3">
        <label className="flex flex-col gap-2 font-normal">
          Ingresa el código de verificación:
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              if (mensaje) setMensaje("");
            }}
            required
            className="border p-2 rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-amber-800 text-white py-2 rounded hover:bg-amber-900 transition"
        >
          Verificar
        </button>
        {mensaje && <p className="mt-2 text-red-600">{mensaje}</p>}
      </form>
    </Card>
  );
}
