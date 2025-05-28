package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record  ReservaRequestDTO (LocalDate fechaEntrega, LocalDate fechaRegreso, LocalTime horaEntrega, LocalTime horaRegreso, String patente, Integer sucursalEntregaId) {}

