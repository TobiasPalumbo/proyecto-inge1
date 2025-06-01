'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle } from 'lucide-react';

interface UploadCarFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface Sucursal {
  idSucursal: number;
  localidad: string;
  direccion: string;
}

interface Categoria {
  id: number;
  descripcion: string;
}

const UploadCarForm: React.FC<UploadCarFormProps> = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const router = useRouter();
  const { correo, rol, adminVerificado, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!correo || rol !== 'admin' || !adminVerificado)) {
      router.replace('/pagina-inicio');
    }
  }, [authLoading, correo, rol, adminVerificado, router]);

  if (authLoading || !correo) {
    return <div className="flex items-center justify-center h-64 text-gray-700">Cargando datos de autenticación...</div>;
  }

  const [patente, setPatente] = useState('');
  const [anio, setAnio] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [sucursal, setSucursal] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [modelosLoading, setModelosLoading] = useState(false);
  const [categoriasLoading, setCategoriasLoading] = useState(false);

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });

  // Estado para mostrar el modal de auto subido
  const [autoSubido, setAutoSubido] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialDataLoading(true);
      try {
        const res = await fetch('http://localhost:8080/admin/subirAuto', {
          credentials: 'include',
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Error HTTP ${res.status}: ${errorMessage || res.statusText}`);
        }

        const data = await res.json();
        setMarcas(data.marcas || []);
        setSucursales(data.sucursales || []);
        setFeedback({ message: '', type: '' });
      } catch (err) {
        console.error('Error al cargar marcas o sucursales:', err);
        setFeedback({
          message: `Error al cargar datos iniciales: ${(err as Error).message}`,
          type: 'error',
        });
      } finally {
        setInitialDataLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!marca) {
      setModelos([]);
      setModelo('');
      setCategorias([]);
      setCategoriaSeleccionada('');
      return;
    }

    const fetchModelos = async () => {
      setModelosLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/admin/subirAuto/marca/${encodeURIComponent(marca)}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Error HTTP ${res.status}: ${errorMessage || res.statusText}`);
        }

        const data = await res.json();
        setModelos(data || []);
        setModelo('');
        setCategorias([]);
        setCategoriaSeleccionada('');
        setFeedback({ message: '', type: '' });
      } catch (err) {
        console.error('Error al cargar modelos:', err);
        setFeedback({ message: `Error al cargar modelos: ${(err as Error).message}`, type: 'error' });
      } finally {
        setModelosLoading(false);
      }
    };
    fetchModelos();
  }, [marca]);

  useEffect(() => {
    if (!modelo || !marca) {
      setCategorias([]);
      setCategoriaSeleccionada('');
      return;
    }

    const fetchCategorias = async () => {
      setCategoriasLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/admin/subirAuto/bodyAuto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ marca, modelo }),
          credentials: 'include',
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Error HTTP ${res.status}: ${errorMessage || res.statusText}`);
        }

        const data: Record<number, string> = await res.json();
        const parsedCategories = Object.entries(data).map(([id, descripcion]) => ({
          id: parseInt(id),
          descripcion,
        }));
        setCategorias(parsedCategories);
        setCategoriaSeleccionada('');
        setFeedback({ message: '', type: '' });
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setFeedback({ message: `Error al cargar categorías: ${(err as Error).message}`, type: 'error' });
      } finally {
        setCategoriasLoading(false);
      }
    };
    fetchCategorias();
  }, [modelo, marca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patente || !anio || !marca || !modelo || !sucursal || !categoriaSeleccionada) {
      setFeedback({ message: 'Por favor, completa todos los campos obligatorios.', type: 'error' });
      return;
    }

    const payload = {
      patente,
      idSucursal: parseInt(sucursal),
      marcaModelo: { marca, modelo },
      anio: `${anio}-01-01`,
      idCategoria: parseInt(categoriaSeleccionada),
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/admin/autoPatente/subirAutoPatente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const msg = await res.text();
        setFeedback({ message: msg || 'Error desconocido al subir el vehículo.', type: 'error' });
        onError(msg);
        return;
      }

      // Mostrar modal y limpiar formulario
      setAutoSubido(true);
      setFeedback({ message: '', type: '' });

      setPatente('');
      setAnio('');
      setMarca('');
      setModelo('');
      setSucursal('');
      setCategoriaSeleccionada('');
      setModelos([]);
      setCategorias([]);

      onSuccess();

      setTimeout(() => {
        setAutoSubido(false);
        router.push('/dashboard-admin/flota');
      }, 2500);
    } catch (err) {
      console.error('Error al subir vehículo:', err);
      setFeedback({ message: `Error al subir vehículo: ${(err as Error).message}`, type: 'error' });
      onError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center ">
        <div className="w-full max-w-xl p-6 bg-white shadow-md rounded-lg border border-amber-500">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Subir Nuevo Vehículo a Flota</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="patente" className="block text-sm font-medium text-gray-700">Patente</label>
              <input
                id="patente"
                type="text"
                value={patente}
                onChange={(e) => setPatente(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Ej: AB123CD"
                required
              />
            </div>

            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
              <select
                id="marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                disabled={initialDataLoading}
                required
              >
                <option value="">{initialDataLoading ? 'Cargando marcas...' : 'Selecciona una marca'}</option>
                {marcas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sucursal" className="block text-sm font-medium text-gray-700">Sucursal</label>
              <select
                id="sucursal"
                value={sucursal}
                onChange={(e) => setSucursal(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                disabled={initialDataLoading}
                required
              >
                <option value="">{initialDataLoading ? 'Cargando sucursales...' : 'Selecciona una sucursal'}</option>
                {sucursales.map((s) => (
                  <option key={s.idSucursal} value={s.idSucursal}>
                    {s.localidad} - {s.direccion}
                  </option>
                ))}
              </select>
            </div>

            {marca && (
              <div>
                <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo</label>
                <select
                  id="modelo"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  disabled={modelosLoading || !modelos.length}
                  required
                >
                  <option value="">
                    {modelosLoading ? 'Cargando modelos...' : (modelos.length ? 'Selecciona un modelo' : 'No hay modelos disponibles para esta marca')}
                  </option>
                  {modelos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {modelo && (
              <>
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    id="categoria"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    disabled={categoriasLoading || !categorias.length}
                    required
                  >
                    <option value="">
                      {categoriasLoading ? 'Cargando categorías...' : (categorias.length ? 'Selecciona una categoría' : 'No hay categorías para este modelo')}
                    </option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="anio" className="block text-sm font-medium text-gray-700">Año</label>
                  <input
                    id="anio"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="Ej: 2010"
                    required
                  />
                </div>
              </>
            )}

            {feedback.message && feedback.type === 'error' && (
              <div className="mt-4 p-3 rounded break-words text-sm w-full bg-red-100 text-red-800">
                {feedback.message}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-6 bg-amber-500 hover:bg-amber-600">
              {loading ? 'Subiendo vehículo...' : 'Subir vehículo'}
            </Button>
          </form>
        </div>
      </div>

      {/* Modal auto subido */}
      {autoSubido && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg text-green-700">¡Nuevo auto subido!</h3>
              <p className="text-sm text-gray-600">Redirigiendo a la flota...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadCarForm;
