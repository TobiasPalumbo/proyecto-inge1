package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

public record AutoPatentesDTO(AutoDTO autoDTO, List<String> patentes) {}
