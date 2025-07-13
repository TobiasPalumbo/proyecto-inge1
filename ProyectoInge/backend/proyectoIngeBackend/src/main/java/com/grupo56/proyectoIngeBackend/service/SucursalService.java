package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.AlquilerRepository;
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
	@Autowired
	private AlquilerRepository alquilerRepo;

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
		Optional<Sucursal> sucu= repository.findByLocalidadAndDireccionAndBorradoFalse(localidad, direcion);
		if(sucu.isPresent() && !sucu.get().isBorrado())
			return false;
		return true;
		
	}
	public String borrarSucursal(Integer idSucursal) {
		Optional<Sucursal> sucursalOp= repository.findById(idSucursal);
		if(sucursalOp.isEmpty())
			return "No hay una sucursal registrada";
		Sucursal sucursal= sucursalOp.get();
		if(empleadoRepo.existsBySucursalAndBorradoFalse(sucursal))
				return "Existen empleados asociados a la sucursal";
		if(autoRepo.existsBySucursalAndBorradoFalse(sucursal))
			return "Existen autos asociados a la sucursal";
		if(reservaRepo.existsBySucursalEntregaAndEstado(sucursal, "pendiente") || reservaRepo.existsBySucursalRegresoAndEstado(sucursal, "pendiente"))
			return "Existen reservas asociadas a la sucursal";
		List<Alquiler> alquileres = alquilerRepo.findAll();
		List<Alquiler> alquileresFiltrados = alquileres.stream().filter(a -> (a.getReserva().getSucursalEntrega().getIdSucursal().equals(idSucursal) 
				|| a.getReserva().getSucursalRegreso().getIdSucursal().equals(idSucursal) && a.getEstado().equals("pendiente"))).toList();
		if(!alquileresFiltrados.isEmpty())
			return "Existen alquileres activos asociados a la sucursal";
		sucursal.setBorrado(true);
		repository.save(sucursal);
		return "Sucursal borrada";
	}


}
