package com.grupo56.proyectoIngeBackend.model;
public record EmpleadoDTO(
		String nombre,
		String apellido,
		String cuil,
		String correo,
		Integer idSucursal,
		String Localidad,
		String direccion) {}
