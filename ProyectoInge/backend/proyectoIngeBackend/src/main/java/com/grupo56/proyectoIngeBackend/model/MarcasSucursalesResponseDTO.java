package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

import lombok.NoArgsConstructor;
@NoArgsConstructor
public record MarcasSucursalesResponseDTO(List<String> marcas, List<Sucursal> sucursales, List<PoliticaCancelacion> politicas) {}
