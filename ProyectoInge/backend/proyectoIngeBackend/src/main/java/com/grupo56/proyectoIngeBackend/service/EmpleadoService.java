package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.EmpleadoRepository;

@Service
public class EmpleadoService {
	@Autowired
	private EmpleadoRepository repository;
	
	public boolean existeEmpleadosEnSucursal(Sucursal sucursal) {
		return repository.existsBySucursalAndBorradoFalse(sucursal);
	}
	public List<Empleado> obtenerEmpleados(){
		return repository.findByBorradoFalse();
	}
}
