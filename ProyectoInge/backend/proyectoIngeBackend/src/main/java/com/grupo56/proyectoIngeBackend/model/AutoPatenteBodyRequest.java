package com.grupo56.proyectoIngeBackend.model;


import java.time.LocalDate;

public class AutoPatenteBodyRequest {
	private String patente;
	private Sucursal sucursal;
	private MarcaModeloRequest marcamodelo;
	private PoliticaCancelacion politica;
	private LocalDate anio;
	public String getPatente() {
		return patente;
	}
	public void setPatente(String patente) {
		this.patente = patente;
	}
	public Sucursal getSucursal() {
		return sucursal;
	}
	public void setSucursal(Sucursal sucursal) {
		this.sucursal = sucursal;
	}
	public MarcaModeloRequest getMarcamodelo() {
		return marcamodelo;
	}
	public void setMarcamodelo(MarcaModeloRequest marcamodelo) {
		this.marcamodelo = marcamodelo;
	}
	public PoliticaCancelacion getPolitica() {
		return politica;
	}
	public void setPolitica(PoliticaCancelacion politica) {
		this.politica = politica;
	}
	public LocalDate getAnio() {
		return anio;
	}
	public void setAnio(LocalDate anio) {
		this.anio = anio;
	}
	
	

}
