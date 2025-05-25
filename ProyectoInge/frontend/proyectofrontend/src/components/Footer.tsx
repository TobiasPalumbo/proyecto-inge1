import { FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <div className="bg-zinc-950 text-white py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaInstagram size={20} />
          <span>AlquilappCar</span>
        </div>
        <p className="text-center flex-1">&copy; 2025 Alquilapp Car. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
