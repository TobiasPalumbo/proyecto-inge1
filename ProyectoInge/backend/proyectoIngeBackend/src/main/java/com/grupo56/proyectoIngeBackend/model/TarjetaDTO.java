package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TarjetaDTO(@NotBlank @Size(min = 16, max = 16) String numero,  @NotBlank String nombreTitular, @NotNull LocalDate fechaVencimiento, @NotBlank @Size(min = 3, max = 3) String CVV, @NotBlank String tipo, double monto, ReservaRequestDTO reservaRequest) {}
