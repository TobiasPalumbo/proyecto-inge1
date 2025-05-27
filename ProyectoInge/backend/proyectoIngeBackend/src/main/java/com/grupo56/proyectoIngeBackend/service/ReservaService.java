package com.grupo56.proyectoIngeBackend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.grupo56.proyectoIngeBackend.model.AutoAdminDTO;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesAdminDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesDTO;
import com.grupo56.proyectoIngeBackend.model.RequestSucursalFechaDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.ReservaRepository;
@Service
public class ReservaService {
	
	@Autowired
	ReservaRepository repository;
	@Autowired
	AutoPatenteService autoPatenteService;
	
	public List<Reserva> obtenerReservaDeSucursal(Sucursal sucursal){
		return repository.findBySucursal(sucursal);
	}
	
	public List<AutoPatente> autosPatentesNoReservados(List<AutoPatente> autosPatentes, Integer idSucursal){
		return repository.autosPatentesNoReservados(autosPatentes, idSucursal);
	}
	public List<AutoPatente> autosPatenteDiponibles(LocalDate fechaEntrega, LocalDate fechaRegreso, Integer idSucursal){
		return repository.autosPatenteDiponibles(fechaEntrega, fechaRegreso, idSucursal);
	}
	
	public List<AutoDTO> autosDTODisponibles(List<AutoPatente> autosPatentesDisiponibles) {		
		return repository.autosDTODisponibles(autosPatentesDisiponibles.stream().map(p -> p.getPatente()).toList());
	}
	
	public List<AutoPatentesDTO> obtenerAutosDisponibles(RequestSucursalFechaDTO request){
		List<AutoPatente> autosPatentesDisponibles = autosPatenteDiponibles(request.fechaEntrega(), request.fechaRegreso(), request.sucursal());
		List<AutoDTO> autosDTOSDisponibles = autosDTODisponibles(autosPatentesDisponibles);
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
		return autoPatentesDTO;
	}
	public List<AutoPatentesAdminDTO> obtenerAutosPatentes(){
		List<AutoPatente> autosPatentes= autoPatenteService.obtenerAutosPatente();
		List<AutoAdminDTO> autoAdminDTO= repository.autosAdminDTO();
		List<AutoPatentesAdminDTO> autoPatentesAdminDTO= new ArrayList();
		autoAdminDTO.stream().forEach(dto -> autoPatentesAdminDTO.add(new AutoPatentesAdminDTO (dto,new ArrayList<String>())));
		for(AutoPatente p : autosPatentes ) {
			for(AutoPatentesAdminDTO dto : autoPatentesAdminDTO){
				if(dto.autoAdminDTO().idAuto().equals(p.getAuto().getIdAuto())&&
				   dto.autoAdminDTO().idCategoria().equals(p.getCategoria().getId())) {
					dto.patentes().add(p.getPatente());
					break;
				}
				
			}
			
		}
		
		return autoPatentesAdminDTO;
		
	}
	
}
