package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.UsuarioServiceImp;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
	@Autowired
	private UsuarioServiceImp usuarioService;
	
	public List<Usuario> listarUsuarios(){
		return usuarioService.obtenerUsuarios();
	}
	@GetMapping("/{correo}")
	public Usuario obtenerUsuarioPorCorreo(@PathVariable String correo) {
		return usuarioService.obtenerUsuarioPorCorreo(correo);
	}
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(Authentication authentication) {
	        if (authentication == null || !authentication.isAuthenticated()) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }

	        Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();

	        return ResponseEntity.ok(Map.of(
	            "correo", usuario.getCorreo(),
	            "rol", usuario.getRol()
	        ));
	    }
	

}
