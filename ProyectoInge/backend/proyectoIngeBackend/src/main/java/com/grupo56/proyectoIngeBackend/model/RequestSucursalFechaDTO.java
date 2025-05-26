package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

public record RequestSucursalFechaDTO(Integer sucursal, LocalDate fechaEntrega, LocalDate fechaRegreso) {

}
