package com.grupo56.proyectoIngeBackend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.EmpleadoDTO;
import com.grupo56.proyectoIngeBackend.service.EmpleadoService;

@Controller
public class EmpleadoController {
	@Autowired
	private EmpleadoService service;
	
	@GetMapping("/admin/listarEmpleados")
	public ResponseEntity<List<EmpleadoDTO>> obtenerEmpleados(){
		List<Empleado> empleados= service.obtenerEmpleados();
		if(!empleados.isEmpty()) {
			List<EmpleadoDTO> empleadosDTO= new ArrayList();
			empleados.stream().forEach(e ->  
				empleadosDTO.add(new EmpleadoDTO(
						e.getNombre(),
						e.getApellido(),
						e.getCuil(),
						e.getUsuario().getCorreo(),
						e.getSucursal().getIdSucursal(),
						e.getSucursal().getLocalidad(),
						e.getSucursal().getDireccion()
						)
						)	
					);
			return ResponseEntity.status(HttpStatus.OK).body(empleadosDTO);
		}
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
