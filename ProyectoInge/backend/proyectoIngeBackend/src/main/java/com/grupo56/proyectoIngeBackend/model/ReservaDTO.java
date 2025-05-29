package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaDTO(Integer idReserva,
		Sucursal sucursalEntrega,
		Sucursal sucursalRegreso,
		AutoDTO auto,
		String estado,
		LocalDate fechaEntrega,
		LocalDate fechaRegreso,
		LocalTime horaEntrega,
		LocalTime horaRegreso) {

}
