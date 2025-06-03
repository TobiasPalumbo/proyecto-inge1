package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
@Repository
public interface AutoPatenteRepository extends JpaRepository<AutoPatente, String>{
	
	public List<AutoPatente> findBySucursal(Sucursal sucursal);

	public boolean existsByPatente(String patente);

    Optional<AutoPatente> findByPatente(String patente);

}
