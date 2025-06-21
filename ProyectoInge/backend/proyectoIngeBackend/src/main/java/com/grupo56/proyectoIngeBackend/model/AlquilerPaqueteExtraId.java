package com.grupo56.proyectoIngeBackend.model;

import java.io.Serializable;
	 
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class AlquilerPaqueteExtraId implements Serializable {

    @Column(name = "idAlquiler")
    private Integer idAlquiler;

    @Column(name = "idPaquete")
    private Integer idPaquete;

   
    public AlquilerPaqueteExtraId() {}

    

	public AlquilerPaqueteExtraId(Integer idAlquiler, Integer idPaquete) {
		super();
		this.idAlquiler = idAlquiler;
		this.idPaquete = idPaquete;
	}



	public Integer getIdAlquiler() {
		return idAlquiler;
	}



	public void setIdAlquiler(Integer idAlquiler) {
		this.idAlquiler = idAlquiler;
	}



	public Integer getIdPaquete() {
		return idPaquete;
	}



	public void setIdPaquete(Integer idPaquete) {
		this.idPaquete = idPaquete;
	}



	// equals()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        AlquilerPaqueteExtraId that = (AlquilerPaqueteExtraId) o;
        
        if (!idAlquiler.equals(that.idAlquiler)) return false;
        return idPaquete.equals(that.idPaquete);
    }

    // hashCode()
    @Override
    public int hashCode() {
        int result = idAlquiler.hashCode();
        result = 31 * result + idPaquete.hashCode();
        return result;
    }
}



