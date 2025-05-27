package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.AutoCategoria;
import com.grupo56.proyectoIngeBackend.model.AutoCompletoResponse;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.Categoria;
import com.grupo56.proyectoIngeBackend.model.MarcaModeloRequest;
import com.grupo56.proyectoIngeBackend.model.MarcasSucursalesResponse;
import com.grupo56.proyectoIngeBackend.model.PoliticaCancelacion;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.service.AutoCategoriaService;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.CategoriaService;
import com.grupo56.proyectoIngeBackend.service.PoliticaCancelacionService;
import com.grupo56.proyectoIngeBackend.service.SucursalService;

import jakarta.validation.Valid;

@RestController
public class AutoController {
	
	@Autowired
	private AutoService service;
	@Autowired
	private AutoCategoriaService serviceAutoCategoria;
	@Autowired
	private CategoriaService serviceCategoria;
	@Autowired
	private SucursalService serviceSucursal;
	@Autowired
	private PoliticaCancelacionService servicePoliticas;
	
	
	@PostMapping("/subirmarca")//NO USAR DE MOMENTO
	public ResponseEntity<String> subirAuto(@RequestBody @Valid Auto auto) {
		if (service.marcaModeloExiste(auto.getIdAuto()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La marca y modelo ya se encuetran cargados");
		service.subirAuto(auto);
		return ResponseEntity.status(HttpStatus.CREATED).body("Auto subido");
	}
	
	@GetMapping("/subirauto")
	public ResponseEntity <MarcasSucursalesResponse> mandarMarcas(){
		List<String> marcas = service.obtenerMarcas();
		List<Sucursal> sucursales= serviceSucursal.obtenerSucursales();
		List<PoliticaCancelacion> politicas= servicePoliticas.obtenerPoliticas();
		MarcasSucursalesResponse respuesta= new MarcasSucursalesResponse(marcas,sucursales,politicas);
		return ResponseEntity.status(HttpStatus.OK).body(respuesta);
	}
	
	@GetMapping("/subirauto/marca/{marca}")
	public ResponseEntity <List<String>> mandarModelo(@PathVariable String marca){
		List<String> modelos = service.obtenerModelos(marca);
		return ResponseEntity.status(HttpStatus.OK).body(modelos);
	}
	
	@GetMapping("/subirauto/bodyAuto")
	public ResponseEntity <List<String>> mandar(@RequestBody MarcaModeloRequest marcaModelo){
		 Integer idAuto = service.obtenerIdAuto(marcaModelo);
		 List<Integer> ids = serviceAutoCategoria.obtenerIdCategorias(idAuto);
		 List<String> categorias = serviceCategoria.obtenerDescripcionById(ids);
		return ResponseEntity.status(HttpStatus.OK).body(categorias);
	}
	
	@GetMapping("/public/autos")
	public ResponseEntity<List<AutoDTO>> obtenerAutos(){
		List<Auto> autos = service.obtenerAutos();
		if (autos.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		List<AutoDTO> autoCompleto =  serviceAutoCategoria.obtenerMatches();
		return ResponseEntity.status(HttpStatus.OK).body(autoCompleto);
	}
}
