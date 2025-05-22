package com.grupo56.proyectoIngeBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.service.AutoPatenteService;

import jakarta.validation.Valid;

@RestController
public class AutoPatenteController {
	
	@Autowired
	private AutoPatenteService service;
	
	
	public ResponseEntity<String> subirAutoPatente(@RequestBody @Valid AutoPatente autoPatente){
		if (service.patenteExiste(autoPatente.getPatente())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La patente ya existe");
		}
		
		service.subirAutoPatente(autoPatente);
		return ResponseEntity.status(HttpStatus.CREATED).body("El auto se ha subido");
	}
	

}
