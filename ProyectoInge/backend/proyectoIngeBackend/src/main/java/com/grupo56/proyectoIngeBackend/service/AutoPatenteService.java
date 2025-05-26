package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.AutoPatenteRepository;

@Service
public class AutoPatenteService {
	
	@Autowired
	private AutoPatenteRepository repository;
	
	public void subirAutoPatente(AutoPatente autoPatente) {
			repository.save(autoPatente);
	}
	
	public List<AutoPatente> obtenerAutosPatente(){
		return repository.findAll();
	}
	
	public boolean patenteExiste(String patente) {
		return repository.existsById(patente);
	}
	
	public List<AutoPatente> obtenerAutoPatenteSucurusal(Sucursal sucursal){
		return repository.findBySucursal(sucursal);
	}
}
