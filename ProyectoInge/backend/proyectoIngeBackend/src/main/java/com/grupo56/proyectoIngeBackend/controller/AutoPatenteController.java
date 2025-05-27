package com.grupo56.proyectoIngeBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.AutoPatenteBodyRequest;
import com.grupo56.proyectoIngeBackend.service.AutoCategoriaService;
import com.grupo56.proyectoIngeBackend.service.AutoPatenteService;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.CategoriaService;
import com.grupo56.proyectoIngeBackend.service.PoliticaCancelacionService;
import com.grupo56.proyectoIngeBackend.service.SucursalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/autoPatente")
public class AutoPatenteController {
	
	@Autowired
	private AutoPatenteService service;
	@Autowired
	private AutoService serviceAuto;
	@Autowired
	private AutoCategoriaService serviceAutoCategoria;
	@Autowired
	private CategoriaService serviceCategoria;
	@Autowired
	private SucursalService serviceSucursal;
	@Autowired
	private PoliticaCancelacionService servicePoliticas;
	
	@PostMapping("/subirAutoPatente")
	public ResponseEntity<String> subirAutoPatente(@RequestBody @Valid AutoPatenteBodyRequest autoPatenteBody){
		AutoPatente nuevoAuto= new AutoPatente();
		nuevoAuto.setPatente(autoPatenteBody.getPatente());
		nuevoAuto.setAnio(autoPatenteBody.getAnio());
		nuevoAuto.setBorrado(false);
		nuevoAuto.setAuto(serviceAuto.obtenerAutoPorId(serviceAuto.obtenerIdAuto(autoPatenteBody.getMarcamodelo())));
		nuevoAuto.setIdSucursal(autoPatenteBody.getSucursal());
		nuevoAuto.setPoliticaCancelacion(autoPatenteBody.getPolitica());
		service.subirAutoPatente(nuevoAuto);
		return ResponseEntity.status(HttpStatus.CREATED).body("El auto se ha subido");
	}
	
	

}
