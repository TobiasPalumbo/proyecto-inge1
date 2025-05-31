package com.grupo56.proyectoIngeBackend.controller;

import java.time.LocalDate;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.Tarjeta;
import com.grupo56.proyectoIngeBackend.model.TarjetaDTO;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.ClienteService;
import com.grupo56.proyectoIngeBackend.service.ReservaService;
import com.grupo56.proyectoIngeBackend.service.TarjetaService;

import jakarta.validation.Valid;

@RestController
public class TarjetaController {
	@Autowired
	private TarjetaService service;
	@Autowired
	private ClienteService clienteService;
	@Autowired
	private ReservaService reservaService;
	
	@PostMapping("/pagarConTarjeta")
	public ResponseEntity<String> pagarConTarjeta(@Valid @RequestBody TarjetaDTO tarjetaDTO,Authentication authentication){
		if (authentication == null || !authentication.isAuthenticated()) 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		if (tarjetaDTO.CVV().isBlank() || tarjetaDTO.numero().isBlank() || tarjetaDTO.nombreTitular().isBlank() || tarjetaDTO.fechaVencimiento() == null) 
			 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Campo/s obligarotorio vacios"); 
		Tarjeta tarjeta = service.obtenerTarjetaPorNumero(tarjetaDTO.numero(), tarjetaDTO.CVV(), tarjetaDTO.fechaVencimiento(), tarjetaDTO.nombreTitular());
		if (tarjeta == null) 
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Credenciales de tarjeta invalida");
		if (tarjetaDTO.fechaVencimiento().isBefore(LocalDate.now()) || tarjetaDTO.fechaVencimiento().isEqual(LocalDate.now())) 
			return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La tarjeta se encunetra vencida");
		if (tarjeta.getMonto() - tarjetaDTO.monto() < 0)
			return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Saldo en la tarjeta insuficiente");
		service.actualizarMontoTarjeta(tarjeta, tarjeta.getMonto() - tarjetaDTO.monto());
		
        Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente= clienteService.obtenerPorUsuario(usuario);
		reservaService.subirReserva(tarjetaDTO.reservaRequest(), cliente, tarjetaDTO.monto(), tarjeta);
		
		return ResponseEntity.status(HttpStatus.ACCEPTED).body("Pago realizado exitosamente, reserva creada y codigo enviado al mail"); 
	}
}
