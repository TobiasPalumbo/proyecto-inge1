package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.PaqueteExtra;
	import com.grupo56.proyectoIngeBackend.repository.PaqueteExtraRepository;

@Service
public class PaqueteExtraService {
	@Autowired
	private PaqueteExtraRepository repository;
	
	public List<PaqueteExtra> obtenerPaquetesExtras(){
		return repository.findAll();
	}
	public List<PaqueteExtra> obtenerPorIdsPaquetesExtras(List<Integer> ids){
		return repository.findAllById(ids);
	}
	
}
