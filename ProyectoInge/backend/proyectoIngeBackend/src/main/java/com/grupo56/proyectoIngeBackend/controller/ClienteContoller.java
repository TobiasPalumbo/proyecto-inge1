package com.grupo56.proyectoIngeBackend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.ClienteDTO;
import com.grupo56.proyectoIngeBackend.model.FechasRequestDTO;
import com.grupo56.proyectoIngeBackend.service.ClienteService;

@RestController
public class ClienteContoller {
	
	@Autowired
	private ClienteService service;
	
	@PostMapping("/admin/clientesRegistrados")
	public ResponseEntity<List<ClienteDTO>> obtenerClientesRegistradoEnFechas(@RequestBody FechasRequestDTO request){
		List<Cliente> clientes  = service.obtenerClientes();
			if (clientes.isEmpty())
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		List<Cliente> clientesFiltrados = 
				clientes.stream().
				filter(c -> 
						(request.fechaInicio().isEqual(c.getFechaRegistro()) 
						|| request.fechaInicio().isBefore(c.getFechaRegistro()))
						&& (request.fechaFin().isEqual(c.getFechaRegistro()) 
						|| request.fechaFin().isAfter(c.getFechaRegistro()))) 
						.toList();
		List<ClienteDTO> clientesDTO = new ArrayList<>();
		for (Cliente c : clientesFiltrados) {
			clientesDTO.add(
					new ClienteDTO(
							c.getDni(), 
							c.getTelefono(), 
							c.getNombre(), 
							c.getApellido(), 
							c.getUsuario().getCorreo(),
							c.getFechaRegistro(), 
							c.getFechaNac())
					);
		}
		return ResponseEntity.status(HttpStatus.OK).body(clientesDTO);
	}
	
}
