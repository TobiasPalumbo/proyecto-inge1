package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.usuario;
import com.grupo56.proyectoIngeBackend.service.usuarioServiceImp;

@RestController
@RequestMapping("/usuario")
public class usuarioController {
	private usuarioServiceImp usuarioService;
	@GetMapping
	public List<usuario> listarUsuarios(){
		return usuarioService.obtenerUsuarios();
	}
	@GetMapping("/{correo}")
	public usuario obtenerUsuarioPorCorreo(@PathVariable String correo) {
		return usuarioService.obtenerUsuarioPorCorreo(correo);
	}
}
