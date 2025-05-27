package com.grupo56.proyectoIngeBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.AutoPatenteBodyRequestDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatenteModRequestDTO;
import com.grupo56.proyectoIngeBackend.service.AutoPatenteService;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.CategoriaService;
import com.grupo56.proyectoIngeBackend.service.PoliticaCancelacionService;
import com.grupo56.proyectoIngeBackend.service.SucursalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/public/autoPatente")
public class AutoPatenteController {
	
	@Autowired
	private AutoPatenteService service;
	@Autowired
	private AutoService serviceAuto;
	@Autowired
	private CategoriaService serviceCategoria;
	@Autowired
	private SucursalService serviceSucursal;
	@Autowired
	private PoliticaCancelacionService servicePoliticas;
	@Autowired
	private AutoPatenteService serviceAutoPatente;

	
	@PostMapping("/subirAutoPatente")
	public ResponseEntity<String> subirAutoPatente(@RequestBody @Valid AutoPatenteBodyRequestDTO autoPatenteBody){
		if(!service.patenteExiste(autoPatenteBody.patente())) {
			AutoPatente nuevoAuto= new AutoPatente();
			nuevoAuto.setPatente(autoPatenteBody.patente());
			nuevoAuto.setAnio(autoPatenteBody.anio());
			nuevoAuto.setBorrado(false);
			nuevoAuto.setAuto(serviceAuto.obtenerAutoPorId(serviceAuto.obtenerIdAuto(autoPatenteBody.marcaModelo())));
			nuevoAuto.setSucursal(autoPatenteBody.sucursal());
			nuevoAuto.setPoliticaCancelacion(servicePoliticas.obteneerPoliticaCancelacionPorId(autoPatenteBody.politica().getIdPoliticaCancelacion()));
			nuevoAuto.setCategoria(serviceCategoria.obtenerCategoriaPorId(autoPatenteBody.idCategoria()));
			service.subirAutoPatente(nuevoAuto);
			return ResponseEntity.status(HttpStatus.CREATED).body("El auto se ha subido");}
		return ResponseEntity.status(HttpStatus.CONFLICT).body("La patente ya se encuentra registrada");
		}
	@PostMapping("/modificarAuto")
	public ResponseEntity<String> modificarAutoPatente(@RequestBody @Valid AutoPatenteModRequestDTO request){
		AutoPatente autoViejo= serviceAutoPatente.obtenerAutoPatentePorPatente(request.patenteVieja());
		if(request.patenteVieja().equals(request.patenteNueva())) {
			autoViejo.setAnio(request.anio());
			autoViejo.setBorrado(request.borrado());
			autoViejo.setCategoria(serviceCategoria.obtenerCategoriaPorId(request.idCategoria()));
			autoViejo.setPoliticaCancelacion(servicePoliticas.obteneerPoliticaCancelacionPorId(request.idPoliticaCancelacion()));
			autoViejo.setSucursal(serviceSucursal.obtenerSucursalPorId(request.idSucursal()));
			autoViejo.setAuto(serviceAuto.obtenerAutoPorId(serviceAuto.obtenerIdAuto(request.marcaModelo())));
			service.subirAutoPatente(autoViejo);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("Auto modificado correctamente");
		}
		autoViejo.setBorrado(true);
		AutoPatente nuevoAuto= new AutoPatente();
		nuevoAuto.setPatente(request.patenteNueva());
		nuevoAuto.setAnio(request.anio());
		nuevoAuto.setBorrado(false);
		nuevoAuto.setAuto(serviceAuto.obtenerAutoPorId(serviceAuto.obtenerIdAuto(request.marcaModelo())));
		nuevoAuto.setSucursal(serviceSucursal.obtenerSucursalPorId(request.idSucursal()));
		nuevoAuto.setPoliticaCancelacion(servicePoliticas.obteneerPoliticaCancelacionPorId(request.idPoliticaCancelacion()));
		nuevoAuto.setCategoria(serviceCategoria.obtenerCategoriaPorId(request.idCategoria()));
		service.subirAutoPatente(nuevoAuto);
		return ResponseEntity.status(HttpStatus.CREATED).body("Auto modificado correctamente");
	}
	@GetMapping("/{patente}")
	public AutoPatente autoPatentePorPatente(@PathVariable String patente) {
		return service.obtenerAutoPatentePorPatente(patente);
		
	} 
	
	}
	
	
	

