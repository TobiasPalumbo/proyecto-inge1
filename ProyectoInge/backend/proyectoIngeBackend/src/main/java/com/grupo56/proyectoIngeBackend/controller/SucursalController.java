package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.SucursalService;

@RestController
public class SucursalController {
	@Autowired
	private SucursalService service;
	@GetMapping("/sucursales")
	public List<Sucursal> obtenerSucursales() {
		return service.obtenerSucursales();
	}

}
