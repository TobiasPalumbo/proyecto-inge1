package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record  ReservaRequestDTO (LocalDate fechaEntrega, LocalDate fechaRegreso, String patente) {}

