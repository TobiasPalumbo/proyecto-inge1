package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

public record AlquilerDTO(
			Integer idAlquiler, 
			double precio, 
			String estadoAlquiler,
			ReservaDTO reserva, 
			List<PaqueteExtraDTO> paquetesExtras) {}
