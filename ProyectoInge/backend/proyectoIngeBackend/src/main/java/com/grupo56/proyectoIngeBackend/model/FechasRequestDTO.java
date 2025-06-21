package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record FechasRequestDTO(
		LocalDate fechaInicio, 
		LocalDate fechaFin) {}
