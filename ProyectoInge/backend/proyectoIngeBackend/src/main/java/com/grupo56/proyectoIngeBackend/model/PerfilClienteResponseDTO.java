package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record PerfilClienteResponseDTO(String nombre, String apellido, String correo, LocalDate fechaNacimiento, LocalDate fechaRegistro) {}

