package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record ClienteDTO(
		int dni, 
		String telefono, 
		String nombre, 
		String apellido, 
		LocalDate fechaRegistro, 
		LocalDate fechaNacimiento
		) {}
