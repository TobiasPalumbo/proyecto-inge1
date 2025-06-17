package com.grupo56.proyectoIngeBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.model.Usuario;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado,Integer>{
	Optional<Empleado> findByUsuario(Usuario usuario);
	
	boolean existsByIdSucursalAndBorradoFalse(Sucursal sucursal);

}