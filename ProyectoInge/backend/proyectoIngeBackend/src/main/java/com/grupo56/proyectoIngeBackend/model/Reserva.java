package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDateTime;
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
	
	@JoinColumn(name = "idSucursalEntrega")
	@ManyToOne
	private Sucursal sucursalEntrega;
	
	@JoinColumn(name = "idSucursalRegreso")
	@ManyToOne	
	private Sucursal sucursalRegreso;
	
	@JoinColumn(name = "idCliente")
	@ManyToOne
	private Cliente cliente;
	
	@Column(length = 20)
	private String estado="confirmado";
	
	@ManyToOne
	@JoinColumn(name = "idTarjeta")
 	private Tarjeta tarjeta;
	
	private LocalDateTime fechaEntrega;
	private LocalDateTime fechaRegreso;
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

	public Sucursal getSucursalEntrega() {
		return sucursalEntrega;
	}
	public void setSucursalEntrega(Sucursal sucursalEntrega) {
		this.sucursalEntrega = sucursalEntrega;
	}
	public Sucursal getSucursalRegreso() {
		return sucursalRegreso;
	}
	public void setSucursalRegreso(Sucursal sucursalRegreso) {
		this.sucursalRegreso = sucursalRegreso;
	}
	public Cliente getCliente() {
		return cliente;
	}
	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}
	public LocalDateTime getFechaRegreso() {
		return fechaRegreso;
	}
	public void setFechaRegreso(LocalDateTime fechaRegreso) {
		this.fechaRegreso = fechaRegreso;
	}
	public double getPrecio() {
		return precio;
	}
	public void setPrecio(double precio) {
		this.precio = precio;
	}
	public String getEstado() {
		return estado;
	}
	public void setEstado(String estado) {
		this.estado = estado;
	}
	public LocalDateTime getFechaEntrega() {
		return fechaEntrega;
	}
	public void setFechaEntrega(LocalDateTime fechaEntrega) {
		this.fechaEntrega = fechaEntrega;
	}
	
	
}
