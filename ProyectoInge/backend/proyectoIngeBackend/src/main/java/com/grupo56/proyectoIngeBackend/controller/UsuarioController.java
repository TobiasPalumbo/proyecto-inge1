package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.UsuarioServiceImp;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
	@Autowired
	private UsuarioServiceImp usuarioService;
	@GetMapping
	public List<Usuario> listarUsuarios(){
		return usuarioService.obtenerUsuarios();
	}
	@GetMapping("/{correo}")
	public Usuario obtenerUsuarioPorCorreo(@PathVariable String correo) {
		return usuarioService.obtenerUsuarioPorCorreo(correo);
	}
}
