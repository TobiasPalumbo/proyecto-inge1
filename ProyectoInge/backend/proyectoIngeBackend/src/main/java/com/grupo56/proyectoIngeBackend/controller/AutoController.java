package com.grupo56.proyectoIngeBackend.controller;



import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.grupo56.proyectoIngeBackend.model.Auto;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPresupuestoDTO;
import com.grupo56.proyectoIngeBackend.model.MarcaModeloRequestDTO;
import com.grupo56.proyectoIngeBackend.model.MarcasSucursalesResponseDTO;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.service.AutoCategoriaService;
import com.grupo56.proyectoIngeBackend.service.AutoService;
import com.grupo56.proyectoIngeBackend.service.CategoriaService;
import com.grupo56.proyectoIngeBackend.service.SucursalService;

import jakarta.validation.Valid;

@RestController
public class AutoController {
	
	@Autowired
	private AutoService service;
	@Autowired
	private AutoCategoriaService serviceAutoCategoria;
	@Autowired
	private CategoriaService serviceCategoria;
	@Autowired
	private SucursalService serviceSucursal;
	
	

	@PostMapping("/admin/subirMarca")//NO USAR DE MOMENTO
	public ResponseEntity<String> subirAuto(@RequestBody @Valid Auto auto) {
		if (service.marcaModeloExiste(auto.getIdAuto()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La marca y modelo ya se encuetran cargados");
		service.subirAuto(auto);
		return ResponseEntity.status(HttpStatus.CREATED).body("Auto subido");
	}
	

	@GetMapping("/admin/subirAuto")
		public ResponseEntity <MarcasSucursalesResponseDTO> mandarMarcas(){
		List<String> marcas = service.obtenerMarcas();
		List<Sucursal> sucursales= serviceSucursal.obtenerSucursales();
		MarcasSucursalesResponseDTO respuesta = new MarcasSucursalesResponseDTO(marcas,sucursales);
		return ResponseEntity.status(HttpStatus.OK).body(respuesta);
	}
	
	@GetMapping("/admin/subirAuto/marca/{marca}")
	public ResponseEntity <List<String>> mandarModelo(@PathVariable String marca){
		List<String> modelos = service.obtenerModelos(marca);
		return ResponseEntity.status(HttpStatus.OK).body(modelos);
	}
	
	@GetMapping("/admin/subirAuto/bodyAuto")
    public ResponseEntity <Map<Integer,String>> mandar(@RequestBody MarcaModeloRequestDTO marcaModelo){
         Integer idAuto = service.obtenerIdAuto(marcaModelo);
         List<Integer> ids = serviceAutoCategoria.obtenerIdCategorias(idAuto);
         List<String> categorias = serviceCategoria.obtenerDescripcionById(ids);
         Map<Integer, String> resultado = new LinkedHashMap<>();
            for (int i = 0; i < ids.size(); i++) {
                resultado.put(ids.get(i), categorias.get(i));
            }
        return ResponseEntity.status(HttpStatus.OK).body(resultado);
    }
	
	@GetMapping("/public/autos")
	public ResponseEntity<List<AutoDTO>> obtenerAutos(){
		List<Auto> autos = service.obtenerAutos();
		if (autos.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		List<AutoDTO> autoCompleto =  serviceAutoCategoria.obtenerMatches();
		return ResponseEntity.status(HttpStatus.OK).body(autoCompleto);
	}
	
	@GetMapping("/public/simularPresupuesto")
	public ResponseEntity<Map<String, Double>> generarPresupuesto(@RequestBody AutoPresupuestoDTO request){
		System.out.println(request);
		Auto auto = service.obtenerAutoPorId(request.id());
		System.out.println(request.id());
		System.out.println(auto);
		Map<String, Double> presupesto = new HashMap<String, Double>();
		if (auto == null)
			 return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		double total = ChronoUnit.DAYS.between(request.fechaEntrega(), request.fechaRegreso()) * auto.getPrecioDia();
		presupesto.put("presuesto", total);
		return ResponseEntity.status(HttpStatus.OK).body(presupesto);
	}
	
}
