package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import com.grupo56.proyectoIngeBackend.model.RequestPaqueteExtraDTO;

public record GenerarAlquilerDTO(Integer idReserva, String dniConductor, String dniSegundoConductor, List<RequestPaqueteExtraDTO> paquetesExtras) {}
