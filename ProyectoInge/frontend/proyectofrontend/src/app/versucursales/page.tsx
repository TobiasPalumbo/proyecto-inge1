import React from "react";

export default function PerfilUsuario({ usuario, onVerReservas }) {
  const { nombre, apellido, correo, fechaNacimiento, fechaRegistro } = usuario;

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Mi Perfil</h2>

      <div className="space-y-2">
        <p><span className="font-semibold">Nombre:</span> {nombre}</p>
        <p><span className="font-semibold">Apellido:</span> {apellido}</p>
        <p><span className="font-semibold">Correo:</span> {correo}</p>
        <p><span className="font-semibold">Fecha de nacimiento:</span> {fechaNacimiento}</p>
        <p><span className="font-semibold">Fecha de registro:</span> {fechaRegistro}</p>
      </div>

      <button
        onClick={onVerReservas}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl mt-4"
      >
        Ver reservas
      </button>
    </div>
  );
}
