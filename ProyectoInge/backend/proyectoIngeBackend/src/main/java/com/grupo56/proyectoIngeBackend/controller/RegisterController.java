package com.grupo56.proyectoIngeBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.RegisterRequest;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.ClienteService;
import com.grupo56.proyectoIngeBackend.service.UsuarioServiceImp;

@RestController

public class RegisterController {
	@Autowired
	private UsuarioServiceImp serviceUsuario;
	@Autowired
	private ClienteService serviceCliente;
	
	@PostMapping("/registrarse")
	public ResponseEntity<?> register(@RequestBody RegisterRequest request){
		if (serviceUsuario.obtenerUsuarioPorCorreo(request.getCorreo()) != null) {
	        // Si el correo ya está registrado
	        return ResponseEntity
	                .status(HttpStatus.CONFLICT) // 409 Conflict
	                .body("El correo ya está registrado.");
	    }
		Usuario nuevoUsuario= new Usuario();
		Cliente nuevoCliente= new Cliente();
		nuevoUsuario.setCorreo(request.getCorreo());
		nuevoUsuario.setContraseña(request.getContraseña());
		nuevoUsuario.setRol("cliente");
		serviceUsuario.subirUsuario(nuevoUsuario);
		nuevoCliente.setApellido(request.getApellido());
		nuevoCliente.setDni(request.getDni());
		nuevoCliente.setFechaNac(request.getFechaNac());
		nuevoCliente.setFechaRegistro(request.getFechaRegistro());
		nuevoCliente.setNombre(request.getNombre());
		nuevoCliente.setTelefono(request.getTelefono());
		nuevoCliente.setIdUsuario(nuevoUsuario);
		serviceCliente.subirCliente(nuevoCliente);
		return ResponseEntity
	            .status(HttpStatus.CREATED) // 201 Created
	            .body("Registro exitoso.");
	
		
	}
}
