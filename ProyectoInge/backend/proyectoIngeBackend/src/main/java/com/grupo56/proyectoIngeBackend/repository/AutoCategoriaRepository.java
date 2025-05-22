package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grupo56.proyectoIngeBackend.model.AutoCategoria;
import com.grupo56.proyectoIngeBackend.model.AutoCategoriaId;

public interface AutoCategoriaRepository extends JpaRepository<AutoCategoria, AutoCategoriaId> {

	@Query("SELECT ac.categoria.idCategoria FROM AutoCategoria ac WHERE ac.auto.idAuto = :idAuto")
    List<Integer> findCategorias(@Param("idAuto") Integer idAuto);
}
