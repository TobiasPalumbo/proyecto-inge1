package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.AutoCategoria;
import com.grupo56.proyectoIngeBackend.model.AutoCategoriaId;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
@Repository
public interface AutoCategoriaRepository extends JpaRepository<AutoCategoria, AutoCategoriaId> {

	@Query("SELECT ac.categoria.idCategoria FROM AutoCategoria ac WHERE ac.auto.idAuto = :idAuto")
    List<Integer> findCategorias(@Param("idAuto") Integer idAuto);
	
	@Query("SELECT new com.grupo56.proyectoIngeBackend.model.AutoDTO(ac.auto.idAuto, ac.categoria.idCategoria, ac.auto.marca, ac.auto.modelo, ac.auto.precioDia, ac.auto.cantidadAsientos, ac.categoria.descripcion, ac.auto.politicaCancelacion.idPoliticaCancelacion, ac.auto.politicaCancelacion.porcentaje) "
			+ "FROM AutoCategoria ac WHERE ac.auto.borrado = false")
	List<AutoDTO> findMatches();
	
}
