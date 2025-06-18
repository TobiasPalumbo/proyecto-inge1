package com.grupo56.proyectoIngeBackend.model;
public record EmpleadoDTO(
		Integer idEmpleado,
		String nombre,
		String apellido,
		String cuil,
		String correo,
		Integer idSucursal,
		String Localidad,
		String direccion) {}
