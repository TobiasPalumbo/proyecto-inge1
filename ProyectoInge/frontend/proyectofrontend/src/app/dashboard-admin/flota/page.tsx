'use client'
import React, { useState, useEffect } from 'react'

interface Sucursal {
  idSucursal: number
  localidad: string
  direccion: string
}

const UploadCarForm = () => {
  const [marcas, setMarcas] = useState<string[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/admin/subirAuto',  {
  credentials: 'include', // para enviar cookies junto con la petición
})
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
        const data = await res.json()
        setMarcas(data.marcas)
        setSucursales(data.sucursales)
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h2>Marcas:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {marcas.map((marca) => (
          <li key={marca}>{marca}</li>
        ))}
      </ul>

      <h2>Sucursales:</h2>
      <ul>
        {sucursales.map((s) => (
          <li key={s.idSucursal}>
            {s.localidad} - {s.direccion}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UploadCarForm
