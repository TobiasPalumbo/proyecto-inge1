package com.grupo56.proyectoIngeBackend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
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


}
