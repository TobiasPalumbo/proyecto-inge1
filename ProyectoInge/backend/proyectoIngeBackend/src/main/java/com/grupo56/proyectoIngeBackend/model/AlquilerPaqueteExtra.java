package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
@Entity
@Table(name = "alquiler_paquete_extra")
public class AlquilerPaqueteExtra {

    @EmbeddedId
    private AlquilerPaqueteExtraId id;

    @ManyToOne
    @MapsId("idAlquiler")
    @JoinColumn(name = "idAlquiler")
    private Alquiler alquiler;

    @ManyToOne
    @MapsId("idPaquete")
    @JoinColumn(name = "idPaquete")
    private PaqueteExtra paqueteExtra;
    
    private int cantidad;
    
    public AlquilerPaqueteExtra() {}

    // Constructor con parámetros
    public AlquilerPaqueteExtra(Alquiler alquiler, PaqueteExtra paqueteExtra, int cantidad) {
        this.id = new AlquilerPaqueteExtraId(alquiler.getIdAlquiler(), paqueteExtra.getIdPaquete());
        this.alquiler = alquiler;
        this.paqueteExtra = paqueteExtra;
        this.cantidad = cantidad;
    }

	public AlquilerPaqueteExtraId getId() {
		return id;
	}

	public void setId(AlquilerPaqueteExtraId id) {
		this.id = id;
	}

	public Alquiler getAlquiler() {
		return alquiler;
	}

	public void setAlquiler(Alquiler alquiler) {
		this.alquiler = alquiler;
	}

	public PaqueteExtra getPaqueteExtra() {
		return paqueteExtra;
	}

	public void setPaqueteExtra(PaqueteExtra paqueteExtra) {
		this.paqueteExtra = paqueteExtra;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

    

}

