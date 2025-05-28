package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "politica_cancelacion")
@NoArgsConstructor
@AllArgsConstructor
public class PoliticaCancelacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idPoliticaCancelacion;
	private double porcentaje;
	public int getIdPoliticaCancelacion() {
		return idPoliticaCancelacion;
	}
	public void setIdPoliticaCancelacion(int idPoliticaCancelacion) {
		this.idPoliticaCancelacion = idPoliticaCancelacion;
	}
	public double getPorcentaje() {
		return porcentaje;
	}
	public void setPorcentaje(double porcentaje) {
		this.porcentaje = porcentaje;
	}
	
}
