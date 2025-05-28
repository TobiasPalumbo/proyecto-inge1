package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.SucursalRepository;

@Service
public class SucursalService {
	@Autowired
	private SucursalRepository repository;
	
	public void subirSucursal(Sucursal sucursal) {
		repository.save(sucursal);
	}
	public List<Sucursal> obtenerSucursales(){
		return repository.findAll();
	}
	public Sucursal obtenerSucursalPorId(Integer id) {
		Optional<Sucursal> sucursal= repository.findById(id);
		if(sucursal.isPresent())
			return sucursal.get();
		return null;
	}


}
