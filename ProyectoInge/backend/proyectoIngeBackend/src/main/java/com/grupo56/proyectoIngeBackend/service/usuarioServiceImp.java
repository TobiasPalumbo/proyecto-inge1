package com.grupo56.proyectoIngeBackend.service;


import java.util.List;
import java.util.Optional;

import com.grupo56.proyectoIngeBackend.model.usuario;
import com.grupo56.proyectoIngeBackend.repository.usuarioRepo;

public class usuarioServiceImp {
	private static final String Optional = null;
	private usuarioRepo usuarioRepository;
	public List <usuario> obtenerUsuarios(){
		return usuarioRepository.findAll();
	}
	public usuario obtenerUsuarioPorCorreo(String correo) {
		Optional<usuario> usuarioOp= usuarioRepository.findByCorreo(correo);
		if(usuarioOp.isPresent()) {
			return usuarioOp.get();
		}
		return null;
	}
	

}
