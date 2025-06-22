package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Categoria {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idCategoria;
	
	@NotBlank(message = "La categoria es obligatora")
	private String descripcion;

	public Integer getId() {
		// TODO Auto-generated method stub
		return idCategoria;
	}
	
	public String getDescripcion() {
		return descripcion;
	}
}
