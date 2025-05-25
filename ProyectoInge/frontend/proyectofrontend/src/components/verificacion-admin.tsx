"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from './ui/card';
import Image from 'next/image';

export default function VerificacionCodigo() {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { correo } = useAuth(); // No necesitás `rol` acá
  const router = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => { 
    e.preventDefault(); 

    try {
      const res = await fetch('http://localhost:8080/autenticacion/verif-admin', { 
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo, correo }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/pagina-inicio");
      } else {
        setMensaje(`Código incorrecto: ${data.mensaje || 'Error'}`);
      }
    } catch (err) {
      setMensaje('Código inválido, intenta de nuevo.');
    }
  };

  return (
    <Card className=' bg-white border border-gray-400 '>
      <Image  src="/logo.png" alt="logo" width={160}
              height={150} className='mx-auto'/>

      <form onSubmit={manejarEnvio} className="flex flex-col gap-4 max-w-md mx-auto p-3">
        <label className="flex flex-col gap-2 font-normal">
          Ingresa el código de verificación:
          <input
            type="text"
            value={codigo}
            onChange={(e) => {setCodigo(e.target.value);
            if (mensaje) setMensaje("");}}
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
