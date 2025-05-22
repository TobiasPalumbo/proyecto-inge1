package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "politica_cancelacion")
public class PoliticaCancelacion {
		
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idPoliticaCancelacion;
	private double porcentaje;
}
