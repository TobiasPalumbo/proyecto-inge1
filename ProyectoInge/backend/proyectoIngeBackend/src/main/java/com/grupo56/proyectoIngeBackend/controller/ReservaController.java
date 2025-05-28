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

import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesAdminDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesDTO;
import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.RequestSucursalFechaDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.ReservaDTO;
import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.ClienteService;
import com.grupo56.proyectoIngeBackend.service.ReservaService;

@RestController
public class ReservaController {
	@Autowired
	private ReservaService service;
	@Autowired
	AutoService autoService;
	@Autowired
	ClienteService clienteService;
	
	@GetMapping("/public/autosDisponibles")
	public ResponseEntity<List<AutoPatentesDTO>> obtenerAutosDisponibles(@RequestBody RequestSucursalFechaDTO request){
		List<AutoPatentesDTO> response = service.obtenerAutosDisponibles(request);
		if (response.isEmpty()) 
			return ResponseEntity.noContent().build();;
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	@GetMapping("/public/autosPatentes")
	public ResponseEntity<List<AutoPatentesAdminDTO>> obtenerAutosPatentes(){
		List<AutoPatentesAdminDTO> response = service.obtenerAutosPatentes();
		if (response.isEmpty()) 
			return ResponseEntity.noContent().build();;
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	@GetMapping("/misReservas")
	public ResponseEntity<List<ReservaDTO>> obtenerReservas(Authentication authentication){
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente= clienteService.obtenerPorUsuario(usuario);
        List<Reserva> reservas= service.obtenerReservasPorCliente(cliente);
        if(reservas.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        List<ReservaDTO> reservasDTO = new ArrayList();
        reservas.stream().forEach(r -> 
        reservasDTO.add(new ReservaDTO(
            r.getIdReserva(),
            r.getSucursalEntrega(),
            r.getSucursalRegreso(),
            new AutoDTO(
                r.getAutoPatente().getAuto().getIdAuto(),
                r.getAutoPatente().getCategoria().getId(),
                r.getAutoPatente().getAuto().getMarca(),
                r.getAutoPatente().getAuto().getModelo(),
                r.getAutoPatente().getAuto().getPrecioDia(),
                r.getAutoPatente().getAuto().getCantidadAsientos(),
                r.getAutoPatente().getCategoria().getDescripcion(),
                r.getAutoPatente().getAuto().getPoliticaCancelacion().getIdPoliticaCancelacion(),
                r.getAutoPatente().getAuto().getPoliticaCancelacion().getPorcentaje()
            ),
            r.getEstado(),
            r.getFechaEntrega().toLocalDate(),
            r.getFechaRegreso().toLocalDate(),
            r.getFechaEntrega().toLocalTime(),
            r.getFechaRegreso().toLocalTime()
        ))
    );

        return ResponseEntity.status(HttpStatus.OK).body(reservasDTO);
        
	}
	@PostMapping("/cancelarReserva")
	public ResponseEntity<?> cancelarReserva(Integer idReserva,Authentication authentication){
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente= clienteService.obtenerPorUsuario(usuario);
        Reserva reserva= service.obtenerReservaPorId(idReserva);
		if(reserva!=null && service.reservaPerteneceAusuario(reserva, cliente)){
			reserva.setEstado("cancelado");
			service.actualizarReserva(reserva);
			return ResponseEntity.status(HttpStatus.OK).body("reserva cancelada");
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("reserva cancelada");
		
		
	} 
}
