package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.repository.AlquilerPaqueteExtraRepository;

@Service
public class AlquilerPaqueteExtraService {
	
	@Autowired
	private AlquilerPaqueteExtraRepository repository;
	
	public List<AlquilerPaqueteExtra> obtenerAlquilerPaquetes(){
		return repository.findAll();
	}
	
	public void guardarAlquilerPaqueteExtra(AlquilerPaqueteExtra aPe) {
		repository.save(aPe);
	}
}
