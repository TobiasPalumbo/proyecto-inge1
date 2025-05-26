package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

public record AutoDTO(Integer idAuto, Integer idCategoria, String marca, String modelo, double precio, int cantidadAsientos, String categoria) {}
