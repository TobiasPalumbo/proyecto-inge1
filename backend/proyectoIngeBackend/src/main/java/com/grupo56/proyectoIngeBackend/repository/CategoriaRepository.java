package com.grupo56.proyectoIngeBackend.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Categoria;
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer>{

	
}
