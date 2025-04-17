package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class auto {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;
	private String nom;
	public auto() {
		super();
	}

	
}
