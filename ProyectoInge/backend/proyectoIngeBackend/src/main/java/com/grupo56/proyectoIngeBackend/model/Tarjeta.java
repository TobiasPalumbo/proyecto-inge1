package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Tarjeta {
	 	@Id
	  	@GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer idTarjeta;
	 	private String numero;
	 	private String nombreTitular;
	 	private LocalDate fechaVencimiento;
	 	private String CVV;
	 	private double monto;
		public Integer getIdTarjeta() {
			return idTarjeta;
		}
		public void setIdTarjeta(Integer idTarjeta) {
			this.idTarjeta = idTarjeta;
		}
		public String getNumero() {
			return numero;
		}
		public void setNumero(String numero) {
			this.numero = numero;
		}
		public String getNombreTitular() {
			return nombreTitular;
		}
		public void setNombreTitular(String nombreTitular) {
			this.nombreTitular = nombreTitular;
		}
		public LocalDate getFechaVencimiento() {
			return fechaVencimiento;
		}
		public void setFechaVencimiento(LocalDate fechaVencimiento) {
			this.fechaVencimiento = fechaVencimiento;
		}
		public String getCVV() {
			return CVV;
		}
		public void setCVV(String cVV) {
			CVV = cVV;
		}
		public double getMonto() {
			return monto;
		}
		public void setMonto(double monto) {
			this.monto = monto;
		}
	 	
	 	
}
