package com.grupo56.proyectoIngeBackend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerDTO;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.FechasRequestDTO;
import com.grupo56.proyectoIngeBackend.model.PaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.PaqueteExtraDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.ReservaDTO;
import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.AlquilerPaqueteExtraService;
import com.grupo56.proyectoIngeBackend.service.AlquilerService;
import com.grupo56.proyectoIngeBackend.service.ClienteService;
import com.grupo56.proyectoIngeBackend.service.ReservaService;

@RestController
public class AlquilerController {
	
	@Autowired
	private AlquilerService service;
	@Autowired
	private ReservaService reservaService;
	@Autowired
	private ClienteService clienteService;
	@Autowired
	private AlquilerPaqueteExtraService alquilerPaqueteExtraService;
	
	@GetMapping("/misAlquileres")
	public ResponseEntity<List<AlquilerDTO>> obetenerAlquiler(Authentication authentication) {
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente= clienteService.obtenerPorUsuario(usuario);
        List<AlquilerDTO> alquileresDTO = new ArrayList<>();
        List<Reserva> reservas = reservaService.obtenerReservasPorCliente(cliente);         	
        List<Alquiler> alquileres = service.obtenerAlquilerPorIdReserva(reservas.stream().map(r -> r.getIdReserva()).toList());
        if (alquileres.isEmpty())
        	return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        List<AlquilerPaqueteExtra> alquileresPaquetesExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
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
					precioTotal+= (aP.getPaqueteExtra().getPrecio() * aP.getCantidad());
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
        			r.getEstado(),
        			r.getFechaEntrega().toLocalDate(),
        			r.getFechaRegreso().toLocalDate(),
        			r.getFechaEntrega().toLocalTime(),
        			r.getFechaRegreso().toLocalTime());
        	AlquilerDTO alquilerDTO = new AlquilerDTO(a.getIdAlquiler(), precioTotal, reservaDTO, paquetesExtras);
        	alquileresDTO.add(alquilerDTO);
		}

        return ResponseEntity.status(HttpStatus.OK).body(alquileresDTO);
	}
	
	
	@PostMapping("/empleado/verAutosAlquiladosEntreFechas")
	public ResponseEntity<?> obtenerAlquileresEntreFechas(@RequestBody FechasRequestDTO request) {
			List<Alquiler> alquileres = service.obtenerAlquileres();
		    List<AutoDTO> autosDTO = new ArrayList<>();
			if (alquileres.isEmpty())
	        	return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			List<Alquiler> alquileresFiltrados = alquileres.stream()	
					.filter(a -> 
							(request.fechaInicio().isEqual(a.getReserva().getFechaEntrega().toLocalDate()))
							|| request.fechaInicio().isBefore(a.getReserva().getFechaEntrega().toLocalDate())
							&& 
							(request.fechaFin().isEqual(a.getFechaRegreso().toLocalDate()) 
							|| request.fechaFin().isAfter(a.getFechaRegreso().toLocalDate())))
							.toList();
		        for (Alquiler a : alquileresFiltrados) {
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
		        	if (!autosDTO.contains(autoDTO))
		        		autosDTO.add(autoDTO);
				}			
			return ResponseEntity.status(HttpStatus.OK).body(autosDTO);
	}
	
	@PostMapping("/registrarDevolucion")
	public ResponseEntity<?> registrarDevolucion(@RequestBody String request){
		return ResponseEntity.status(null).build();
	}
}
