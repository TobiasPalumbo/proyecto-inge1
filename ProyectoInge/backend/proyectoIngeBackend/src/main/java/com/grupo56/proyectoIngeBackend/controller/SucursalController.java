package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.IdSucursalDTO;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.model.SucursalDTO;
import com.grupo56.proyectoIngeBackend.service.SucursalService;

import jakarta.validation.Valid;

@RestController
public class SucursalController {
	@Autowired
	private SucursalService service;

	@GetMapping("/public/sucursales")
	public List<Sucursal> obtenerSucursales() {
		return service.obtenerSucursales();
	}
	@PostMapping("/admin/subirSucursal")
	public ResponseEntity<String> subirSucursal(@RequestBody @Valid SucursalDTO request){
		if(service.sucursalNoExiste(request.direccion(), request.localidad())) {
			Sucursal nuevaSucursal= new Sucursal();
			nuevaSucursal.setLocalidad(request.localidad());
			nuevaSucursal.setDireccion(request.direccion());
			service.subirSucursal(nuevaSucursal);
			return ResponseEntity.status(HttpStatus.CREATED).body("La sucursal se a subido");
			}

		return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya hay una sucursal en esa localidad y direccion");
	}
	
	@PostMapping("/admin/darDeBajaSucursal")
	public ResponseEntity<String> darDeBajaSucursal(@RequestBody IdSucursalDTO idSucursalDTO){
		String info = service.borrarSucursal(idSucursalDTO.idSucursal());
		if (info.equals("Sucursal borrada"))
			return ResponseEntity.status(HttpStatus.CREATED).body("La sucursal se ha dado de baja");
		return ResponseEntity.status(HttpStatus.CONFLICT).body(info);
	}
	
	}
	


