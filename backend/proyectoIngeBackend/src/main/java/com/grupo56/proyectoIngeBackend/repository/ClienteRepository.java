package com.grupo56.proyectoIngeBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.Usuario;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente,Integer>{
	Optional<Cliente> findByUsuario(Usuario usuario);

}
