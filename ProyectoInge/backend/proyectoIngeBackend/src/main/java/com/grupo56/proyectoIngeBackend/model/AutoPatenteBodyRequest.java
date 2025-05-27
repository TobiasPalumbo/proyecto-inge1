package com.grupo56.proyectoIngeBackend.model;


import java.time.LocalDate;

public record  AutoPatenteBodyRequest (String patente, Sucursal sucursal, MarcaModeloRequestDTO marcaModelo, PoliticaCancelacion politica, LocalDate anio, Integer idCategoria) {}
