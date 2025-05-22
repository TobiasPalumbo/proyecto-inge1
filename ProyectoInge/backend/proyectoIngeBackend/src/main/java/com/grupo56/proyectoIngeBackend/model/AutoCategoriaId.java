package com.grupo56.proyectoIngeBackend.model;
import java.io.Serializable;
import jakarta.persistence.Embeddable;
import java.util.Objects;

@Embeddable
public class AutoCategoriaId implements Serializable {

    private Integer idAuto;
    private Integer idCategoria;


    public AutoCategoriaId() {}

    public AutoCategoriaId(Integer idAuto, Integer idCategoria) {
        this.idAuto = idAuto;
        this.idCategoria = idCategoria;
    }

    // Getters y Setters
    public Integer getIdAuto() {
        return idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AutoCategoriaId)) return false;
        AutoCategoriaId that = (AutoCategoriaId) o;
        return Objects.equals(idAuto, that.idAuto) &&
               Objects.equals(idCategoria, that.idCategoria);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idAuto, idCategoria);
    }
}

