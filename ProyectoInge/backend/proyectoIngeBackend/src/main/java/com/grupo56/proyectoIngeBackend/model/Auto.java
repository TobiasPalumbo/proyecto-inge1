package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "auto")
public class Auto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idAuto;
	@NotBlank(message = "La marca es obligatoria")
	private String marca;
	@NotBlank(message = "El modelo es obligatorio")
	private String modelo;
	@NotBlank(message = "La cantidad de asientos es obligatoria")
	private int cantidadAsientos;
	@NotBlank(message = "El precio es obligatorio")
	@Positive(message  = "El precio debe ser mayor a 0")
	private double precioDia;
	private boolean borrado = false;

	
	public Integer getIdAuto() {
		return idAuto;
	}


	public String getMarca() {
		return marca;
	}


	public void setMarca(String marca) {
		this.marca = marca;
	}


	public String getModelo() {
		return modelo;
	}


	public void setModelo(String modelo) {
		this.modelo = modelo;
	}


	public int getCantidadAsientos() {
		return cantidadAsientos;
	}


	public void setCantidadAsientos(int cantidadAsientos) {
		this.cantidadAsientos = cantidadAsientos;
	}


	public double getPrecioDia() {
		return precioDia;
	}


	public void setPrecioDia(double precioDia) {
		this.precioDia = precioDia;
	}


	public boolean isBorrado() {
		return borrado;
	}


	public void setBorrado(boolean borrado) {
		this.borrado = borrado;
	}


	public void setIdAuto(Integer idAuto) {
		this.idAuto = idAuto;
	}
	
	
}
