package com.grupo56.proyectoIngeBackend.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
@NoArgsConstructor
public class MarcasSucursalesResponse {
	private List<String> marcas;
	private List<Sucursal> sucursales;
	private List<PoliticaCancelacion> politicas;
	
	
	public MarcasSucursalesResponse(List<String> marcas, List<Sucursal> sucursales,
			List<PoliticaCancelacion> politicas) {
		super();
		this.marcas = marcas;
		this.sucursales = sucursales;
		this.politicas = politicas;
	}
	public List<String> getMarcas() {
		return marcas;
	}
	public void setMarcas(List<String> marcas) {
		this.marcas = marcas;
	}
	public List<Sucursal> getSucursales() {
		return sucursales;
	}
	public void setSucursales(List<Sucursal> sucursales) {
		this.sucursales = sucursales;
	}
	public List<PoliticaCancelacion> getPoliticas() {
		return politicas;
	}
	public void setPoliticas(List<PoliticaCancelacion> politicas) {
		this.politicas = politicas;
	}

}
