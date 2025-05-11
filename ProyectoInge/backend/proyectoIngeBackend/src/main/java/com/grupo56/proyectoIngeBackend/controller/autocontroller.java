package com.grupo56.proyectoIngeBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.auto;
import com.grupo56.proyectoIngeBackend.service.autoserviceimp;
//Expone los endpoints y llama a los metodos que se relacionan con la base de datos, o simplemente hace otra cosa como un calculo etc 
@RestController  //porque es apiRest
@RequestMapping("/auto_patente")  //Endpoint base
public class autocontroller {
	@Autowired
	private autoserviceimp autoService;
	
	@GetMapping
	public List<auto> listarAutos(){
		return autoService.obtenerAutos();        //Post guet mapping etc son las peticiones http 
	}
	@PostMapping("/cargarAuto") // Endpoint //el requestbody trae el cuerpo directamente por ej un json de auto y lo interpreta para la base datos 
	public auto agregarAuto(@RequestBody auto car) { 
		return autoService.cargarAuto(car);
	}
	@DeleteMapping("/borrar/{patente}")
	public void borrarAuto(@PathVariable String patente) {
		autoService.borrarAuto(patente);
	}
	 @DeleteMapping("/borrar-todos")
	    public ResponseEntity<String> borrarTodosYReiniciar() {
	        // Borrar todos los autos
	        autoService.borrarTodo();

	        // Reiniciar el AUTO_INCREMENT
	        autoService.reiniciarIdCount();

	        return ResponseEntity.ok("Todos los autos fueron borrados");
	    }
	
}
