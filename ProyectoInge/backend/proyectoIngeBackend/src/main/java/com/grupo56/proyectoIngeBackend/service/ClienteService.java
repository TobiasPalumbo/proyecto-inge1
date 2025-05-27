package com.grupo56.proyectoIngeBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.repository.ClienteRepository;

@Service
public class ClienteService {
	@Autowired
	private ClienteRepository repository;
	public List<Cliente> obtenerClientes(){
		return repository.findAll();
	}
	public void subirCliente(Cliente cliente) {
		repository.save(cliente);
	}
	public Cliente obtenerPorUsuario(Usuario usuario) {
		Optional<Cliente> cliente= repository.findByUsuario(usuario); 
		if(cliente.isPresent())
			return cliente.get();
		return null;
	}
}
