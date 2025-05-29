package com.grupo56.proyectoIngeBackend.model;


import java.time.LocalDate;


import jakarta.validation.constraints.NotBlank;

public record  AutoPatenteBodyRequestDTO (@NotBlank String patente, Sucursal sucursal, MarcaModeloRequestDTO marcaModelo, LocalDate anio, Integer idCategoria) {}

