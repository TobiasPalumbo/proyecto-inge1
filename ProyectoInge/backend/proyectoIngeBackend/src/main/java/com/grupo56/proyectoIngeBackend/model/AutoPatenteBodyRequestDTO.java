package com.grupo56.proyectoIngeBackend.model;


import java.time.LocalDate;


import jakarta.validation.constraints.NotBlank;

public record  AutoPatenteBodyRequestDTO (
		@NotBlank String patente,
		Integer idSucursal,
		MarcaModeloRequestDTO marcaModelo,
		LocalDate anio,
		Integer idCategoria) {}

