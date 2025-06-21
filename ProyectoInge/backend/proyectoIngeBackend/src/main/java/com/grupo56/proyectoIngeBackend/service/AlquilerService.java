package com.grupo56.proyectoIngeBackend.service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerDTO;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.PaqueteExtraDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.ReservaDTO;
import com.grupo56.proyectoIngeBackend.repository.AlquilerRepository;
@Service
public class AlquilerService {
	@Autowired
	private AlquilerRepository repository;
	
 	public List<Alquiler> obtenerAlquieresDeSemana(LocalDate dia){
		WeekFields semanaEstandar = WeekFields.of(Locale.getDefault());
		int semana = dia.get(semanaEstandar.weekOfYear());	
		int anio = dia.getYear();
		return repository.findAll().stream()
				.filter(a -> a.getReserva().getFechaEntrega().toLocalDate().get(semanaEstandar.weekOfYear()) == semana 
				&&  a.getReserva().getFechaEntrega().toLocalDate().getYear() == anio)
				.toList();
 	}
 	
	public boolean existsByReserva(Reserva reserva) {
		return repository.existsByReserva(reserva);
	}
	public List<Alquiler> obtenerAlquilerPorIdReserva(List<Integer> idsReserva){
		return repository.findByReservaIdReservaIn(idsReserva);
	}
	
	public List<Alquiler> obtenerAlquileres() {
		return repository.findAll();
	}

	public void guardarAlquiler(Alquiler a) {
		repository.save(a);
	}
	
	public List<Alquiler> obtenerAlquilerPorIdSucursalEntrega(Integer idSucursal){
		return repository.findAll().stream().filter(r -> r.getReserva().getSucursalEntrega().getIdSucursal() == idSucursal).toList();
	}
	
	public List<Alquiler> obtenerAlquilerPorIdSucursalRegreso(Integer idSucursal){
		return repository.findAll().stream().filter(r -> r.getReserva().getSucursalRegreso().getIdSucursal() == idSucursal).toList();
	}
	
	public List<AlquilerDTO> construirAlquileresDTO(List<Alquiler> alquileres, List<AlquilerPaqueteExtra> alquileresPaquetesExtras) {
		 List<AlquilerDTO> alquileresDTO = new ArrayList<>();
	      for (Alquiler a : alquileres) {
	        	List<PaqueteExtraDTO> paquetesExtras = new ArrayList<>();
	        	double precioTotal = a.getPrecio();
	        	for (AlquilerPaqueteExtra aP : alquileresPaquetesExtras) {
					if (aP.getAlquiler().getIdAlquiler() == a.getIdAlquiler()) {
						paquetesExtras.add(
								new PaqueteExtraDTO(
									aP.getPaqueteExtra().getIdPaquete(), 
									aP.getPaqueteExtra().getTipoPaquete(), 
									aP.getPaqueteExtra().getPrecio(),
									aP.getCantidad()
									)
								);
					}
				}	
	        	Reserva r = a.getReserva();
	        	AutoPatente aP = r.getAutoPatente();
	        	AutoDTO autoDTO = new AutoDTO(
	                    aP.getAuto().getIdAuto(),
	                    aP.getCategoria().getId(),
	                    aP.getAuto().getMarca(),
	                    aP.getAuto().getModelo(),
	                    aP.getAuto().getPrecioDia(),
	                    aP.getAuto().getCantidadAsientos(),
	                    aP.getCategoria().getDescripcion(),
	                    aP.getAuto().getPoliticaCancelacion().getIdPoliticaCancelacion(),
	                    aP.getAuto().getPoliticaCancelacion().getPorcentaje()
	                );
	        	ReservaDTO reservaDTO = new ReservaDTO(
	        			r.getIdReserva(),
	        			r.getSucursalEntrega(),
	        			r.getSucursalRegreso(),
	        			autoDTO, 
	        			r.getPrecio(),
	        			r.getEstado(),
	        			r.getFechaEntrega().toLocalDate(),
	        			r.getFechaRegreso().toLocalDate(),
	        			r.getFechaEntrega().toLocalTime(),
	        			r.getFechaRegreso().toLocalTime());
	        	AlquilerDTO alquilerDTO = new AlquilerDTO(a.getIdAlquiler(), precioTotal, reservaDTO, paquetesExtras);
	        	alquileresDTO.add(alquilerDTO);
	      }
	      return alquileresDTO;
	}
}
