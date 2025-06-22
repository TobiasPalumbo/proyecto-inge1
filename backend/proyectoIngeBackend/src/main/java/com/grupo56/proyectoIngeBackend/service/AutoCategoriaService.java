package com.grupo56.proyectoIngeBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.AutoCategoria;
import com.grupo56.proyectoIngeBackend.model.AutoCategoriaId;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.Categoria;
import com.grupo56.proyectoIngeBackend.repository.AutoCategoriaRepository;
@Service
public class AutoCategoriaService {
	@Autowired
	private AutoCategoriaRepository repository;
	
	
	public List<Integer> obtenerIdCategorias(Integer idAuto){
		return repository.findCategorias(idAuto);
	}
	
	public List<AutoCategoria> obteneraAutoCategorias(){
		return repository.findAll();
	}
	
	public List<AutoDTO> obtenerMatches(){
		return repository.findMatches();
	}
	
	public AutoDTO obtenerMatch(Auto auto, Categoria categoria){
		AutoDTO autoCompleto = null;
		if (repository.findById(new AutoCategoriaId(auto.getIdAuto(), categoria.getId())).orElse(null) != null) {
			autoCompleto = new AutoDTO(auto.getIdAuto(), categoria.getId(), auto.getMarca(), auto.getModelo(), auto.getPrecioDia(), auto.getCantidadAsientos(), categoria.getDescripcion(), auto.getPoliticaCancelacion().getIdPoliticaCancelacion(), auto.getPoliticaCancelacion().getPorcentaje());
		}
		return autoCompleto;
	}
}
