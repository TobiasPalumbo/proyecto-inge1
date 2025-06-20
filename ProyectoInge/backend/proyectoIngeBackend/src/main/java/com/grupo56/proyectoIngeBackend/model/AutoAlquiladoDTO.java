package com.grupo56.proyectoIngeBackend.model;

public class AutoAlquiladoDTO {
	private AutoDTO auto;
	private int cantida;
	
	public AutoAlquiladoDTO(AutoDTO auto, int cantida) {
		super();
		this.auto = auto;
		this.cantida = cantida;
	}

	public AutoDTO getAuto() {
		return auto;
	}

	public void setAuto(AutoDTO auto) {
		this.auto = auto;
	}

	public int getCantida() {
		return cantida;
	}

	public void setCantida(int cantida) {
		this.cantida = cantida;
	}
	
	
}
