package com.grupo56.proyectoIngeBackend.service;


import java.util.List;
import java.util.Optional;

import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.repository.UsuarioRepository;

public class UsuarioServiceImp {
	private static final String Optional = null;
	private UsuarioRepository usuarioRepository;
	public List <Usuario> obtenerUsuarios(){
		return usuarioRepository.findAll();
	}
	public Usuario obtenerUsuarioPorCorreo(String correo) {
		Optional<Usuario> usuarioOp= usuarioRepository.findByCorreo(correo);
		if(usuarioOp.isPresent()) {
			return usuarioOp.get();
		}
		return null;
	}
	

}
