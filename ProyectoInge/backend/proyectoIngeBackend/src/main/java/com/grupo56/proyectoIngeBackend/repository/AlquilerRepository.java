package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;

@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Integer> {
	
	List<Alquiler> findByReservaIdReservaIn(List<Integer> idReservas);

}
