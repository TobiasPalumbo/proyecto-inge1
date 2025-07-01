package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.util.List;

public record GananciaSemanalDTO(
		int semana, 
		LocalDate dia,
		double gananciaTotal, 
		List<GananciaDiariaDTO> gananciasDiaras) {}
