package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record  AutoPatenteModRequestDTO (
		String patenteVieja, 
		String patenteNueva,
		Integer idSucursal,
		MarcaModeloRequestDTO marcaModelo, 
		LocalDate anio, 
		Integer idCategoria, 
		boolean borrado) {}

