package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

public record GananciaSemanalDTO(int semana, int mes, double gananciaTotal, List<GananciaDiariaDTO> gananciasDiaras) {}
