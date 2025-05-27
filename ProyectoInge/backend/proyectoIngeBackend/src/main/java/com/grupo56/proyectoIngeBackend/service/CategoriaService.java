package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Categoria;
import com.grupo56.proyectoIngeBackend.repository.CategoriaRepository;

import lombok.Data;
@Service
@Data
public class CategoriaService {
	
	@Autowired
	private CategoriaRepository repositoy;
	
	public void subirCategoria(Categoria categoria) {
		repositoy.save(categoria);
	}
	
	public List<String> obtenerCategoriaId(List<Integer> ids){
		return repositoy.findAllById(ids).stream().map(c -> c.getDescripcion()).toList();
	}
	public List<Categoria> obtenerCategorias(){
		return repositoy.findAll();
	}
}
