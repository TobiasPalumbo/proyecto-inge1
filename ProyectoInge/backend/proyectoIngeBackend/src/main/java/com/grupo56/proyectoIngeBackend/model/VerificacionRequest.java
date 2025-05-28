package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record VerificacionRequest(String correo, String codigo) {}
