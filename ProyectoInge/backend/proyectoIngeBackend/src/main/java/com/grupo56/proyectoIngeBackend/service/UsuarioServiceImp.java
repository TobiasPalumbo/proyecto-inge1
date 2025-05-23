package com.grupo56.proyectoIngeBackend.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.repository.UsuarioRepository;
@Service
public class UsuarioServiceImp {
	private static final String Optional = null;
	@Autowired
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
	public void subirUsuario(Usuario usuario) {
		usuarioRepository.save(usuario);
	}
	

}
