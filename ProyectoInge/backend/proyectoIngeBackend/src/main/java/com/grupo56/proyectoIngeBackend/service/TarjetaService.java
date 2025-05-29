package com.grupo56.proyectoIngeBackend.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Tarjeta;
import com.grupo56.proyectoIngeBackend.repository.TarjetaRepository;

@Service
public class TarjetaService {
	@Autowired
	private TarjetaRepository repository;
	
	public Tarjeta obtenerTarjetaPorNumero(String numero, String CVV, LocalDate fechaVencimiento, String nombreTitular) {
		return repository.obtenerTarjetaPorNumero(numero, CVV, fechaVencimiento, nombreTitular);
	}
	
	public void acutilizarMontoTarjeta(Tarjeta tarjeta, double nuevoMonto) {
		if(tarjeta != null) {
			tarjeta.setMonto(nuevoMonto);
			repository.save(tarjeta);
		}
	}
	
	public void subirTarjeta(Tarjeta tarjeta) {
		repository.save(tarjeta);
	}
}
