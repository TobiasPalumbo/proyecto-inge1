package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.PoliticaCancelacion;
import com.grupo56.proyectoIngeBackend.repository.PoliticaCancelacionRepository;

@Service
public class PoliticaCancelacionService {
	@Autowired
	private PoliticaCancelacionRepository repository;
	public List<PoliticaCancelacion> obtenerPoliticasCancelacion(){
		return repository.findAll();
	}
	public PoliticaCancelacion obteneerPoliticaCancelacionPorId(Integer id) {
		Optional<PoliticaCancelacion> politica= repository.findById(id);
		if(politica.isPresent())
			return politica.get();
		return null;
	}
	public List<PoliticaCancelacion> obtenerPoliticas(){
		return repository.findAll();
	}

}
