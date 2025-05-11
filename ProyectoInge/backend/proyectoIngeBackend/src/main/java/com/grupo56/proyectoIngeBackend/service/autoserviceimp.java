package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.auto;
import com.grupo56.proyectoIngeBackend.repository.autorepo;
//aca esta la logica de la entidad, metodos llamados desde el controller 
@Service
public class autoserviceimp {
	@Autowired
	private autorepo autoRepository;
	
	public List<auto> obtenerAutos(){
		return autoRepository.findAll();
	}
	public auto cargarAuto(auto car) {
		return autoRepository.save(car);
	}
	public void borrarAuto( String patente) {
		autoRepository.deleteById(patente);
	}
	public void borrarTodo() {
		autoRepository.deleteAll();
	}
	public void reiniciarIdCount() {
		autoRepository.resetAutoIncrement();
	}
	
}
