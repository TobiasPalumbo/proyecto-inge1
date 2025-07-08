package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.AutoPatenteRepository;
import com.grupo56.proyectoIngeBackend.repository.EmpleadoRepository;
import com.grupo56.proyectoIngeBackend.repository.ReservaRepository;
import com.grupo56.proyectoIngeBackend.repository.SucursalRepository;

@Service
public class SucursalService {
	@Autowired
	private SucursalRepository repository;
	@Autowired
	private EmpleadoRepository empleadoRepo;
	@Autowired
	private AutoPatenteRepository autoRepo;
	@Autowired
	private ReservaRepository reservaRepo;
	
	public void subirSucursal(Sucursal sucursal) {
		repository.save(sucursal);
	}
	public List<Sucursal> obtenerSucursales(){
		List<Sucursal> sucursales= repository.findAll();
		return sucursales.stream().filter(s -> !s.isBorrado()).toList();
	}
	public Sucursal obtenerSucursalPorId(Integer id) {
		Optional<Sucursal> sucursal= repository.findById(id);
		if(sucursal.isPresent())
			return sucursal.get();
		return null;
	}
	public boolean sucursalNoExiste(String direcion, String localidad) {
		Optional<Sucursal> sucu= repository.findByLocalidadAndDireccion(localidad, direcion);
		if(sucu.isPresent() && !sucu.get().isBorrado())
			return false;
		return true;
		
	}
	public boolean borrarSucursal(Integer idSucursal) {
		Optional<Sucursal> sucursalOp= repository.findById(idSucursal);
		if(sucursalOp.isEmpty())
			return false;
		Sucursal sucursal= sucursalOp.get();
		boolean hayEmpleadosActivos= empleadoRepo.existsBySucursalAndBorradoFalse(sucursal);
		boolean hayAutosActivos=autoRepo.existsBySucursalAndBorradoFalse(sucursal);
		boolean hayReservasActivas= reservaRepo.existsBySucursalEntregaOrSucursalRegresoAndEstadoNot(sucursal, sucursal,"cancelado");
		if(!hayEmpleadosActivos && !hayAutosActivos && !hayReservasActivas) {
			sucursal.setBorrado(true);
			repository.save(sucursal);
			return true;
		}
		return false;
	}


}
