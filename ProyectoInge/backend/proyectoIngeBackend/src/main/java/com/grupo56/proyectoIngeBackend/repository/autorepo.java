package com.grupo56.proyectoIngeBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.auto;
@Repository
public interface autorepo extends JpaRepository <auto,Integer> {

}
