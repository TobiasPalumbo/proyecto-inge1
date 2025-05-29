package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record  ReservaRequestDTO (
		LocalDate fechaEntrega,
		LocalDate fechaRegreso,
		LocalTime horaEntrega,
		LocalTime horaRegreso,
		List<String> patentes,
		Integer sucursalEntregaId) {}

