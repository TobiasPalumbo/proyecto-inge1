package com.grupo56.proyectoIngeBackend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.grupo56.proyectoIngeBackend.model.AltaEmpleadoDTO;
import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.EmpleadoDTO;
import com.grupo56.proyectoIngeBackend.model.IdEmpleadoDTO;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.EmpleadoService;
import com.grupo56.proyectoIngeBackend.service.SucursalService;
import com.grupo56.proyectoIngeBackend.service.UsuarioServiceImp;

@Controller
public class EmpleadoController {
	@Autowired
	private EmpleadoService service;
	@Autowired
	private UsuarioServiceImp usuarioService;
	@Autowired
	private SucursalService sucursalService;
	
	@GetMapping("/admin/listarEmpleados")
	public ResponseEntity<List<EmpleadoDTO>> obtenerEmpleados(){
		List<Empleado> empleados= service.obtenerEmpleados();
		if(!empleados.isEmpty()) {
			List<EmpleadoDTO> empleadosDTO= new ArrayList();
			empleados.stream().forEach(e ->  
				empleadosDTO.add(new EmpleadoDTO(
						e.getId_empleado(),
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
	
	@PostMapping("/admin/subirEmpleado")
	public ResponseEntity<?> subirEmpleado(@RequestBody AltaEmpleadoDTO request){
		if(service.empleadoExiste(request.cuil()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "El empleado con dicho cuil ya existe"));
		if(usuarioService.exiteUsuario(request.correo()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Ya hay un usuario registrado con ese correo"));
		Usuario nuevoUsuario= new Usuario();
		Empleado nuevoEmpleado= new Empleado();
		nuevoUsuario.setCorreo(request.correo());
		nuevoUsuario.setContraseña(request.contraseña());
		nuevoUsuario.setRol("empleado");
		usuarioService.subirUsuario(nuevoUsuario);
		nuevoEmpleado.setNombre(request.nombre());
		nuevoEmpleado.setApellido(request.apellido());
		nuevoEmpleado.setCuil(request.cuil());
		nuevoEmpleado.setSucursal(sucursalService.obtenerSucursalPorId(request.idSucursal()));
		nuevoEmpleado.setUsuario(nuevoUsuario);
		service.subirEmpleado(nuevoEmpleado);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Alta de empleado exitosa"));
	}
	@PostMapping("/admin/bajaEmpleado")
	public ResponseEntity<?> bajaEmpleado(@RequestBody IdEmpleadoDTO request){
		Empleado empleado= service.obtenerEmpleadoPorId(request.idEmpleado());
		if(empleado.isBorrado())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "El empleado ya esta dado de baja"));
		empleado.setBorrado(true);
		Usuario usuario= empleado.getUsuario();
		usuario.setBorrado(true);
		usuarioService.subirUsuario(usuario);
		service.subirEmpleado(empleado);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "El empleado fue borrado"));
	
	}
	

}
