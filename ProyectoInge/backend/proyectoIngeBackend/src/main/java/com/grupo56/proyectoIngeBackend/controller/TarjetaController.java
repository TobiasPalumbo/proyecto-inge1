package com.grupo56.proyectoIngeBackend.controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.AutoPresupuestoDTO;
import com.grupo56.proyectoIngeBackend.model.Tarjeta;
import com.grupo56.proyectoIngeBackend.model.TarjetaDTO;
import com.grupo56.proyectoIngeBackend.service.TarjetaService;

import jakarta.validation.Valid;

@RestController
public class TarjetaController {
	
	private TarjetaService service;
	
	@PostMapping("/public/pagarConTarjeta")
	public ResponseEntity<String> pagarConTarjeta(@Valid @RequestBody TarjetaDTO tarjetaDTO){
		if (tarjetaDTO.CVV().isBlank() || tarjetaDTO.numero().isBlank() || tarjetaDTO.nombreTitular().isBlank() || tarjetaDTO.fechaVencimiento() == null || tarjetaDTO.tipo().isBlank()) 
			 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Campo/s obligarotorio vacios"); 
		Tarjeta tarjeta = service.obtenerTarjetaPorNumero(tarjetaDTO.numero(), tarjetaDTO.CVV(), tarjetaDTO.fechaVencimiento(), tarjetaDTO.nombreTitular(), tarjetaDTO.tipo());
		if (tarjeta == null) 
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Credenciales de tarjeta invalida");
		if (tarjetaDTO.fechaVencimiento().isBefore(LocalDate.now()) || tarjetaDTO.fechaVencimiento().isEqual(LocalDate.now())) 
			return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La tarjeta se encunetra vencida");
		if (tarjeta.getMonto() - tarjetaDTO.monto() < 0)
			return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Saldo en la tarjeta insuficiente");
		service.acutilizarMontoTarjeta(tarjeta, tarjeta.getMonto() - tarjetaDTO.monto());
		return ResponseEntity.status(HttpStatus.ACCEPTED).body("Pago realizado exitosamente"); 
	}
}
