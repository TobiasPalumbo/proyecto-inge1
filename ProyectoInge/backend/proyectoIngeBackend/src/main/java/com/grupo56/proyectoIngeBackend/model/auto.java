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
	 public int getId() { return id; }
	    public void setId(int id) { this.id = id; }

	    public String getNom() { return nom; }
	    public void setNom(String nom) { this.nom = nom; }
	
}
