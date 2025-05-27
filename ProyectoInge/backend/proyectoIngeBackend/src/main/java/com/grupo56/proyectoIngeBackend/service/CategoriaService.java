package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Categoria;
import com.grupo56.proyectoIngeBackend.repository.CategoriaRepository;

import lombok.Data;
@Service
@Data
public class CategoriaService {
	
	@Autowired
	private CategoriaRepository repository;
	
	public void subirCategoria(Categoria categoria) {
		repository.save(categoria);
	}
	
	public List<String> obtenerDescripcionById(List<Integer> ids){
		return repository.findAllById(ids).stream().map(c -> c.getDescripcion()).toList();
	}
	public List<Categoria> obtenerCategorias(){
		return repository.findAll();
	}
	public Categoria obtenerCategoriaPorId(Integer id) {
		Optional<Categoria> categoria= repository.findById(id);
		if(categoria.isPresent())
			return categoria.get();
		return null;
	}
}
