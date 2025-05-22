package com.grupo56.proyectoIngeBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Usuario;

@Repository
public interface  UsuarioRepository extends JpaRepository  <Usuario,Integer> {
	Optional<Usuario> findByCorreo(String correo);

}
