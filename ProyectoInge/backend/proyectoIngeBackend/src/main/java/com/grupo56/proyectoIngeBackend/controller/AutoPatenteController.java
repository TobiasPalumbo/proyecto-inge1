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
import com.grupo56.proyectoIngeBackend.service.AutoPatenteService;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.CategoriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/autoPatente")
public class AutoPatenteController {
	
	@Autowired
	private AutoPatenteService service;
	@Autowired
	private AutoService serviceAuto;
	@Autowired
	private CategoriaService serviceCategoria;
	
	@PostMapping("/subirAutoPatente")
    public ResponseEntity<String> subirAutoPatente(@RequestBody @Valid AutoPatenteBodyRequest autoPatenteBody){
        if(!service.patenteExiste(autoPatenteBody.patente())) {
            AutoPatente nuevoAuto= new AutoPatente();
            nuevoAuto.setPatente(autoPatenteBody.patente());
            nuevoAuto.setAnio(autoPatenteBody.anio());
            nuevoAuto.setBorrado(false);
            nuevoAuto.setAuto(serviceAuto.obtenerAutoPorId(serviceAuto.obtenerIdAuto(autoPatenteBody.marcaModelo())));
            nuevoAuto.setSucursal(autoPatenteBody.sucursal());
            nuevoAuto.setPoliticaCancelacion(autoPatenteBody.politica());
            nuevoAuto.setCategoria(serviceCategoria.obtenerCategoriaPorId(autoPatenteBody.idCategoria()));
            service.subirAutoPatente(nuevoAuto);
            return ResponseEntity.status(HttpStatus.CREATED).body("El auto se ha subido");}
        return ResponseEntity.status(HttpStatus.CONFLICT).body("La patente ya se encuentra registrada");
        }
	
	

}
