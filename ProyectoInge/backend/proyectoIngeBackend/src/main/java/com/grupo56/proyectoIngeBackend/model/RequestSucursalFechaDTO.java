package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record RequestSucursalFechaDTO(Integer sucursal, LocalDate fechaEntrega, LocalDate fechaRegreso, LocalTime horaEntrega, LocalTime horaRegreso) {}
