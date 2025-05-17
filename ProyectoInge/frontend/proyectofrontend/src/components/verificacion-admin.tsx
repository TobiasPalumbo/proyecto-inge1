"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificacionCodigo() {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [correo, setCorreo] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // Obtener correo desde localStorage al montar el componente
    const emailGuardado = localStorage.getItem('correo');
    const rolGuardado = localStorage.getItem('rol');

    if (rolGuardado !== 'admin') {
      // Redirigir a la página de inicio si el rol no es admin
      router.push('/pagina-inicio');
    }
    
    if (emailGuardado) {
      setCorreo(emailGuardado);
    }
  }, [router]);  // router en dependencia porque es un hook externo

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
        setMensaje(`❌ Código incorrecto: ${data.mensaje || 'Error'}`);
      }
    } catch (err) {
      setMensaje('❌ Error de conexión con el servidor.');
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <label className="flex flex-col gap-2">
        Ingresá el código de verificación:
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          className="border p-2 rounded"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Verificar
      </button>
      {mensaje && <p className="mt-2">{mensaje}</p>}
    </form>
  );
}
