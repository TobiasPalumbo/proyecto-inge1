package com.grupo56.proyectoIngeBackend.model;


import java.time.LocalDate;

public record  AutoPatenteBodyRequestDTO (String patente, Sucursal sucursal, MarcaModeloRequestDTO marcaModelo, PoliticaCancelacion politica, LocalDate anio, Integer idCategoria) {}
