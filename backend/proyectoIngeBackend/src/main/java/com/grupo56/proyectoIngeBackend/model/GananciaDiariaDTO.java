package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record GananciaDiariaDTO(
		LocalDate dia, 
		double ganancia) {}
