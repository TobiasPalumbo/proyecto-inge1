package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

public record GenerarAlquilerDTO(Integer idReserva, String dniConductor, String dniSegundoConductor, List<RequestPaqueteExtraDTO> paquetesExtras) {}
