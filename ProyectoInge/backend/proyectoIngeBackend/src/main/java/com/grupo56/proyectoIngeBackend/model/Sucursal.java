package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Sucursal {

		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Integer idSucursal;
		private String localidad;
		private String direccion;
}
