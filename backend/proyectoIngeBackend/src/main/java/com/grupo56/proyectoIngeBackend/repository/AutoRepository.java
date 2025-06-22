package com.grupo56.proyectoIngeBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Auto;
import java.util.List;
@Repository
public interface AutoRepository extends JpaRepository<Auto, Integer> {
	@Query("SELECT DISTINCT a.marca FROM Auto a")
    List<String> findDistinctMarcas();
	
	@Query("SELECT a.modelo FROM Auto a WHERE a.marca = :marca")
    List<String> findModelo(@Param("marca") String marca);
	
	@Query("SELECT a.idAuto FROM Auto a WHERE a.marca = :marca AND a.modelo = :modelo")
    Integer findIdAuto(@Param("marca") String marca, @Param("modelo") String modelo);

}
