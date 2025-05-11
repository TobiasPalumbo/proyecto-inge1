package com.grupo56.proyectoIngeBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.usuario;

@Repository
public interface  usuarioRepo extends JpaRepository  <usuario,Integer> {
	Optional<usuario> findByCorreo(String correo);

}
