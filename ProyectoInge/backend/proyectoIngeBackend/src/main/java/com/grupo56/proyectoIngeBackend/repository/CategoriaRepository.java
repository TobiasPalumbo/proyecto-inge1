package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Categoria;
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer>{

	
}
