package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.repository.AlquilerRepository;
@Service
public class AlquilerService {
	@Autowired
	private AlquilerRepository repository;
	
	public List<Alquiler> obtenerAlquilerPorIdReserva(List<Integer> idsReserva){
		return repository.findByReservaIdReservaIn(idsReserva);
	}
	
	public List<Alquiler> obtenerAlquileres() {
		return repository.findAll();
	}

}
