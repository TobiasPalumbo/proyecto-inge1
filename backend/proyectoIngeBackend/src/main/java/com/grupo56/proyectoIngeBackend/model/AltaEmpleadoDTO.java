package com.grupo56.proyectoIngeBackend.model;

public record AltaEmpleadoDTO(
		String nombre,
		String apellido,
		String cuil,
		Integer idSucursal,
		String correo,
		String contraseña) {}