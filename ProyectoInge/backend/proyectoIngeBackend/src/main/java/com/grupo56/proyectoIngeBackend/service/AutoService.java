package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.MarcaModeloRequest;
import com.grupo56.proyectoIngeBackend.repository.AutoRepository;

@Service
public class AutoService {
	
	@Autowired
	private AutoRepository repository;
	
	
	public void subirAuto(Auto auto) {
		repository.save(auto);
	}
	
	public List<Auto> obtenerAutos(){
		return 	repository.findAll();
	}
	
	
	public boolean marcaModeloExiste(Integer id) {
		return repository.existsById(id);
	}
	
	public List<String> obtenerMarcas(){
		return repository.findDistinctMarcas();
	}
	
	public List<String> obtenerModelos(String marca){
		return repository.findModelo(marca);
	}
	
	public Integer obtenerIdAuto(MarcaModeloRequest marcaModelo) {
		return repository.findIdAuto(marcaModelo.getMarca(), marcaModelo.getModelo());
	}
	public Auto obtenerAutoPorId(Integer id ) {
		Optional<Auto> autoOp= repository.findById(id);
		if(autoOp.isPresent())
			return autoOp.get();
		return null;
	}
}
