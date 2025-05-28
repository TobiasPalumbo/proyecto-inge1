package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
public record RegisterRequest(Integer dni, String telefono, String nombre, String apellido, LocalDate fechaRegistro, LocalDate fechaNac, String correo, String contraseña) {}


