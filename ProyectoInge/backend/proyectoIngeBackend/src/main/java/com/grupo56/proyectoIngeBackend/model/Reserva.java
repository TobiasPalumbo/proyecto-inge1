package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="reserva")
public class Reserva {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idReserva;
	
	@ManyToOne
	@JoinColumn(name = "patente", referencedColumnName = "patente")
	private AutoPatente autoPatente;
	
	@JoinColumn(name = "idSucursal")
	@ManyToOne
	private Sucursal sucursal;
	
	@JoinColumn(name = "idCliente")
	@ManyToOne
	private Cliente cliente;
	
	@Column(length = 20)
	private String estado;
	
	private LocalDate fechaEntrega;
	private LocalDate fechaRegreso;
	private double precio;
	
	
	public Integer getIdReserva() {
		return idReserva;
	}
	public void setIdReserva(Integer idReserva) {
		this.idReserva = idReserva;
	}
	public AutoPatente getAutoPatente() {
		return autoPatente;
	}
	public void setAutoPatente(AutoPatente autoPatente) {
		this.autoPatente = autoPatente;
	}
	public Sucursal getSucursal() {
		return sucursal;
	}
	public void setSucursal(Sucursal sucursal) {
		this.sucursal = sucursal;
	}
	public Cliente getCliente() {
		return cliente;
	}
	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}
	public LocalDate getFecheEntrega() {
		return fechaEntrega;
	}
	public void setFecheEntrega(LocalDate fecheEntrega) {
		this.fechaEntrega = fecheEntrega;
	}
	public LocalDate getFechaRegreso() {
		return fechaRegreso;
	}
	public void setFechaRegreso(LocalDate fechaRegreso) {
		this.fechaRegreso = fechaRegreso;
	}
	public double getPrecio() {
		return precio;
	}
	public void setPrecio(double precio) {
		this.precio = precio;
	}
	
	
}
