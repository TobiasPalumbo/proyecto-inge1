package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Alquiler {
	
	@Id
	private Integer idAlquiler;
	
	@JoinColumn(name = "idReserva")
	@OneToOne
	private Reserva reserva;
	
	private LocalDateTime fechaRegreso;
	
	private double precio;
	
	private String estado = "pendiente";
	

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	
	public Integer getIdAlquiler() {
		return idAlquiler;
	}

	public void setIdAlquiler(Integer idAlquiler) {
		this.idAlquiler = idAlquiler;
	}

	public Reserva getReserva() {
		return reserva;
	}

	public void setReserva(Reserva reserva) {
		this.reserva = reserva;
	}

	public double getPrecio() {
		return precio;
	}

	public void setPrecio(double precio) {
		this.precio = precio;
	}

	public LocalDateTime getFechaRegreso() {
		return fechaRegreso;
	}

	public void setFechaRegreso(LocalDateTime fechaRegreso) {
		this.fechaRegreso = fechaRegreso;
	}

	
	
	
}
