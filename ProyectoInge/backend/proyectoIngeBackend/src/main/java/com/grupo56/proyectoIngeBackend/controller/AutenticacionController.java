package com.grupo56.proyectoIngeBackend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.LoginRequest;
import com.grupo56.proyectoIngeBackend.model.VerificacionRequest;
import com.grupo56.proyectoIngeBackend.model.usuario;
import com.grupo56.proyectoIngeBackend.repository.usuarioRepo;
import com.grupo56.proyectoIngeBackend.service.CorreoServiceImp;

@RestController
@RequestMapping("/autenticacion")

public class AutenticacionController {
	private final Map<String,String> codigos= new HashMap<>();
	@Autowired
	private usuarioRepo usuarioRepository;
	@Autowired
	private CorreoServiceImp correoService;
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request){
		Optional<usuario> usuarioOp= usuarioRepository.findByCorreo(request.getCorreo());
		if(usuarioOp.isEmpty() || !usuarioOp.get().getContraseña().equals(request.getContraseña())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales invalidas");
		}
		usuario usuario1=usuarioOp.get();
		
		if(!usuario1.getRol().equals("admin")) {
			return ResponseEntity.ok(Map.of(
					"correo",usuario1.getCorreo(),
					"rol",usuario1.getRol()
					));
		}
		String codigo= String.valueOf(new Random().nextInt(9000)+1000);
		codigos.put(usuario1.getCorreo(), codigo);
		correoService.enviarCodigo(usuario1.getCorreo(), codigo);
		return ResponseEntity.ok(Map.of(
				"correo",usuario1.getCorreo(),
				"rol",usuario1.getRol(),
				"codigo",codigo));
		
	}
	@PostMapping("/verif-admin")
	public ResponseEntity<?> verifAdmin(@RequestBody VerificacionRequest request){
		String codigoCorrecto= codigos.get(request.getCorreo());
		if (codigoCorrecto==null || !codigoCorrecto.equals(request.getCodigo())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Codigo invalido");
		}
		codigos.remove(request.getCorreo());
		return ResponseEntity.status(HttpStatus.ACCEPTED).body("codigo valido");
		
	}

}
