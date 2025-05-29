package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="auto_patente")
public class AutoPatente {
	@Id
	@Column(length = 20)
	private String patente;
	
	@JoinColumn(name = "idCategoria")
	@ManyToOne
	private Categoria categoria;
	@JoinColumn(name = "idAuto")
	@ManyToOne
	private Auto auto;
	@ManyToOne
	@JoinColumn(name = "idSucursal")
	private Sucursal sucursal;
	private LocalDate anio;
	private boolean borrado = false;
	
	
	public String getPatente() {
		return patente;
	}

	public Auto getAuto() {
		return auto;
	}

	public void setAuto(Auto auto) {
		this.auto = auto;
	}

	public Sucursal getIdSucursal() {
		return sucursal;
	}

	public void setSucursal(Sucursal sucursal) {
		this.sucursal = sucursal;
	}

	public LocalDate getAnio() {
		return anio;
	}

	public void setAnio(LocalDate anio) {
		this.anio = anio;
	}

	public boolean isBorrado() {
		return borrado;
	}

	public void setBorrado(boolean borrado) {
		this.borrado = borrado;
	}

	public void setPatente(String patente) {
		this.patente = patente;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public Sucursal getSucursal() {
		return sucursal;
	}
	
	
}
