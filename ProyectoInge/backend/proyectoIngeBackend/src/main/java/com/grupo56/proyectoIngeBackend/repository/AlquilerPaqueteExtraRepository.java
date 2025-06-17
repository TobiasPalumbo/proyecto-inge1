package com.grupo56.proyectoIngeBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtraId;

@Repository
public interface AlquilerPaqueteExtraRepository extends JpaRepository<AlquilerPaqueteExtra, AlquilerPaqueteExtraId>{

}
