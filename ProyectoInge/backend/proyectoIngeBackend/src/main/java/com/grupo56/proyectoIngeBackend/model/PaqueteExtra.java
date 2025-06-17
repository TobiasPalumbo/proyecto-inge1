package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity(name = "paquete_extra")
public class PaqueteExtra {
	
	@Id
	private Integer idPaquete;
	
	private String tipoPaquete;
	
	private double precio;

	public Integer getIdPaquete() {
		return idPaquete;
	}

	public void setIdPaquete(Integer idPaquete) {
		this.idPaquete = idPaquete;
	}

	public String getTipoPaquete() {
		return tipoPaquete;
	}

	public void setTipoPaquete(String tipoPaquete) {
		this.tipoPaquete = tipoPaquete;
	}

	public double getPrecio() {
		return precio;
	}

	public void setPrecio(double precioPaquete) {
		this.precio = precioPaquete;
	}
	
}
