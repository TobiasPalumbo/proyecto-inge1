package com.grupo56.proyectoIngeBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.PoliticaCancelacion;

@Repository
public interface PoliticaCancelacionRepository extends JpaRepository<PoliticaCancelacion,Integer> {

}
