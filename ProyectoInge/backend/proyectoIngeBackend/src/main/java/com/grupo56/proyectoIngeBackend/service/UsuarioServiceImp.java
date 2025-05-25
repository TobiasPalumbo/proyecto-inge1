package com.grupo56.proyectoIngeBackend.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class UsuarioServiceImp implements UserDetailsService{
	private static final String Optional = null;
	@Autowired
	private UsuarioRepository usuarioRepository;
	public List <Usuario> obtenerUsuarios(){
		return usuarioRepository.findAll();
	}
	public UserDetails loadUserByUsername(String correo) {
		Optional<Usuario> usuarioOp= usuarioRepository.findByCorreo(correo);
		if(usuarioOp.isPresent()) {
			return new SecurityUser(usuarioOp.get());
		}
		throw new UsernameNotFoundException("usuario no encontrado");
	}
	public void subirUsuario(Usuario usuario) {
		usuarioRepository.save(usuario);
	}
	public Usuario obtenerUsuarioPorCorreo(String correo) {
		Optional<Usuario> usuarioOp1= usuarioRepository.findByCorreo(correo);
		if(usuarioOp1.isPresent()) {
			return usuarioOp1.get();
		}
	    return null;
	}
	

}
