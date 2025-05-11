package com.grupo56.proyectoIngeBackend.repository;
// REPOSITORY ACA SE DEFINE COMO INTERACTUA NUESTRO SV CON LA DB, JPA SE USA POR EJ PARA MYSQL TIENE VARIAS FUNCIONALIDADES 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.grupo56.proyectoIngeBackend.model.auto;
@Repository
public interface autorepo extends JpaRepository <auto,String> {
	
	// Método para resetear el AUTO_INCREMENT
    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE auto AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();

}
