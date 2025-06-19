package com.grupo56.proyectoIngeBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.PaqueteExtra;

@Repository
public interface PaqueteExtraRepository extends JpaRepository<PaqueteExtra, Integer> {

}
