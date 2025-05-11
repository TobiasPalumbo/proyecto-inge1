package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="auto_patente")
public class auto {
	@Id
	@Column(length = 20)
	private String patente;
	private String nom;
	public auto() {
		super();
	}
	 public String getId() { return patente; }
	    public void setId(String patente) { this.patente = patente; }

	    public String getNom() { return nom; }
	    public void setNom(String nom) { this.nom = nom; }
	
}
