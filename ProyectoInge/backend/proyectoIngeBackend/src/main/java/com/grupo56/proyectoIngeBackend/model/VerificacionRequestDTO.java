package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record VerificacionRequestDTO(String correo, String codigo) {}
