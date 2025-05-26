package com.grupo56.proyectoIngeBackend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.ReservaRepository;
@Service
public class ReservaService {
	
	@Autowired
	ReservaRepository repository;
	
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
	
}
