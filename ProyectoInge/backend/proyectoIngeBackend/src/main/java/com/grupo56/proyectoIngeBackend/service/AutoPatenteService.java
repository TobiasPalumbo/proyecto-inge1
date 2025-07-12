package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.AlquilerRepository;
import com.grupo56.proyectoIngeBackend.repository.AutoPatenteRepository;
import com.grupo56.proyectoIngeBackend.repository.ReservaRepository;

@Service
public class AutoPatenteService {
	
	@Autowired
	private AutoPatenteRepository repository;
	@Autowired
	private ReservaRepository reservaRepo;
	@Autowired
	private AlquilerRepository alquilerRepo;
	
	
	public void subirAutoPatente(AutoPatente autoPatente) {
			repository.save(autoPatente);
	}
	
	public List<AutoPatente> obtenerAutosPatente(){
		return repository.findByBorradoFalse();
	}
	
	public boolean patenteExiste(String patente) {
		return repository.existsByPatente(patente);
	}
	
	public List<AutoPatente> obtenerAutoPatenteSucurusal(Sucursal sucursal){
		return repository.findBySucursal(sucursal);
	}
	public AutoPatente obtenerAutoPatentePorPatente(String patente) {
		Optional<AutoPatente> autoPatente= repository.findByPatente(patente);
		if(autoPatente.isPresent())
			return autoPatente.get();
		return null;
		
	}
	public boolean existenAutosEnSucursal(Sucursal sucursal) {
		return repository.existsBySucursalAndBorradoFalse(sucursal);
	}
	
	public boolean autoTieneReservasConfirmadas(Integer autoId) {
	    return reservaRepo.existsReservasConfirmadas(autoId);
	}
	
	public boolean autoTieneReservasPendientes(Integer autoId) {
	    return reservaRepo.existsReservasPendientes(autoId);
	}
	
	public boolean autoTieneAlquilerConfirmada(Integer autoId) {
	    return alquilerRepo.existsAlquilerPendientePorAuto(autoId);
	}
}
