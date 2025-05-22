package com.grupo56.proyectoIngeBackend.model;


import jakarta.persistence.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "auto_categoria")
public class AutoCategoria {

    @EmbeddedId
    private AutoCategoriaId id;

    @ManyToOne
    @MapsId("idAuto")
    @JoinColumn(name = "idAuto")
    private Auto auto;

    @ManyToOne
    @MapsId("idCategoria")
    @JoinColumn(name = "idCategoria")
    private Categoria categoria;

    // Constructor
    public AutoCategoria() {}

    public AutoCategoria(Auto auto, Categoria categoria) {
        this.auto = auto;
        this.categoria = categoria;
        this.id = new AutoCategoriaId(auto.getIdAuto(), categoria.getId());
    }

    // Getters y Setters
    public AutoCategoriaId getId() {
        return id;
    }

    public void setId(AutoCategoriaId id) {
        this.id = id;
    }

    public Auto getAuto() {
        return auto;
    }

    public void setAuto(Auto auto) {
        this.auto = auto;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}

