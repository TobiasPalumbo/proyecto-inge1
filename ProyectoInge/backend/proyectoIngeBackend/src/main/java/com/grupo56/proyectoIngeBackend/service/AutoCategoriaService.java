package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.repository.AutoCategoriaRepository;
@Service
public class AutoCategoriaService {
	@Autowired
	private AutoCategoriaRepository repository;
	
	
	public List<Integer> obtenerIdCategorias(Integer idAuto){
		return repository.findCategorias(idAuto);
	}
}
