package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.model.Usuario;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado,Integer>{
	public Optional<Empleado> findByUsuario(Usuario usuario);
	
	public boolean existsBySucursalAndBorradoFalse(Sucursal sucursal);
	
	public List<Empleado> findByBorradoFalse();
	
	public boolean existsByCuilAndBorradoFalse(String cuil);
	


}