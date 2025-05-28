package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

public record AutoPatentesAdminDTO(AutoAdminDTO autoAdminDTO, List<String> patentes) {}

