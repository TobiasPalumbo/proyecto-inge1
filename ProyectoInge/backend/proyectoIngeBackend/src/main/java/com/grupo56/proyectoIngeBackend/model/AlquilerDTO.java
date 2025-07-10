package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record AlquilerDTO(
			Integer idAlquiler, 
			double precio, 
			double precioExtra,
			LocalDate diaHoy, 
			LocalTime horaHoy,
			String estadoAlquiler,
			ReservaDTO reserva, 
			List<PaqueteExtraDTO> paquetesExtras) {}
