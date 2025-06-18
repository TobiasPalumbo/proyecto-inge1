package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record ClienteDTO(
		int dni, 
		String telefono, 
		String nombre, 
		String apellido, 
		String correo,
		LocalDate fechaRegistro, 
		LocalDate fechaNacimiento
		) {}
