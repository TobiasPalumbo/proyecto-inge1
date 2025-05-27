package com.grupo56.proyectoIngeBackend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.LoginRequest;
import com.grupo56.proyectoIngeBackend.model.VerificacionRequest;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.CorreoServiceImp;
import com.grupo56.proyectoIngeBackend.service.UsuarioServiceImp;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController

@RequestMapping("/public/autenticacion")

public class AutenticacionController {
	private final Map<String,String> codigos= new HashMap<>();
	@Autowired
	private UsuarioServiceImp usuarioService;
	@Autowired
	private CorreoServiceImp correoService;
	@Autowired
	private AuthenticationManager authenticationManager;
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
		Usuario usuario1= usuarioService.obtenerUsuarioPorCorreo(request.getCorreo());
		if(usuario1==null || !usuario1.getContraseña().equals(request.getContraseña())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Credenciales invalidas"));
		}
		if(!usuario1.getRol().equals("admin")) {
			Authentication authentication = authenticationManager.authenticate(
		            new UsernamePasswordAuthenticationToken(
		                request.getCorreo(), request.getContraseña()
		            )
		        );
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
			 HttpSession session = httpRequest.getSession(true);
		        session.setAttribute(
		            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
		            SecurityContextHolder.getContext()
		        );
		        return ResponseEntity.ok(Map.of(
		                "correo", usuario1.getCorreo(),
		                "rol", usuario1.getRol()
		            ));
		        
			
		}
		 String codigo = String.valueOf(new Random().nextInt(9000) + 1000);
	        codigos.put(usuario1.getCorreo(), codigo);
	        correoService.enviarCodigo("carlos_andres01.10@hotmail.com", codigo);
	       
	        return ResponseEntity.ok(Map.of(
	            "correo", usuario1.getCorreo(),
	            "rol", usuario1.getRol()
	        ));
	}

	@PostMapping("/verif-admin")
	public ResponseEntity<?> verifAdmin(@RequestBody VerificacionRequest request, HttpServletRequest httpRequest){
		String codigoCorrecto= codigos.get(request.getCorreo());
		if (codigoCorrecto==null || !codigoCorrecto.equals(request.getCodigo())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Codigo invalido");
		}
		
		codigos.remove(request.getCorreo());
		Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(request.getCorreo());
		Authentication authentication = authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                usuario.getCorreo(), usuario.getContraseña()
	            )
	        );
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		 HttpSession session = httpRequest.getSession(true);
	        session.setAttribute(
	            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
	            SecurityContextHolder.getContext()
	        );
		return ResponseEntity.status(HttpStatus.ACCEPTED).body("codigo valido");
		
	}
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request) {
	    HttpSession session = request.getSession(false);
	    if (session != null) {
	        session.invalidate();  // invalida la sesión en el servidor
	    }
	    SecurityContextHolder.clearContext(); // limpia el contexto de seguridad
	    return ResponseEntity.ok("Sesión cerrada correctamente");
	}


}
