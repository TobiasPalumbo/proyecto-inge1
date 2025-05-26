package com.grupo56.proyectoIngeBackend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesDTO;
import com.grupo56.proyectoIngeBackend.model.RequestSucursalFechaDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.service.AutoCategoriaService;
import com.grupo56.proyectoIngeBackend.service.AutoPatenteService;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.ReservaService;
@RestController
public class ReservaController {
	@Autowired
	private ReservaService service;
	
	@Autowired
	private AutoPatenteService serviceAutoPatente;
	
	@Autowired
	private AutoCategoriaService autoCategoriaService;
	
	@GetMapping("/public/autoDisponibles")
	public ResponseEntity<List<AutoPatentesDTO>> obtenerAutosDisponibles(@RequestBody RequestSucursalFechaDTO request){
		List<AutoPatente> autosPatentesDisponibles = service.autosPatenteDiponibles(request.fechaEntrega(), request.fechaRegreso(), request.sucursal());
		List<AutoDTO> autosDTOSDisponibles = service.autosDTODisponibles(autosPatentesDisponibles);
		List<AutoPatentesDTO> autoPatentesDTO = new ArrayList();
		autosDTOSDisponibles.stream().forEach(dto -> autoPatentesDTO.add(new AutoPatentesDTO(dto, new ArrayList<String>())));	
		for (AutoPatente p : autosPatentesDisponibles) {
		    for (AutoPatentesDTO dto : autoPatentesDTO) {
		        if (dto.autoDTO().idAuto().equals(p.getAuto().getIdAuto()) &&
		            dto.autoDTO().idCategoria().equals(p.getCategoria().getId())) {
		            dto.patentes().add(p.getPatente());	
		            break;	
		        }
		    }
		}
		return ResponseEntity.status(HttpStatus.OK).body(autoPatentesDTO);
	}
}
