package com.grupo56.proyectoIngeBackend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerDTO;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.AutoAlquiladoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.FechasRequestDTO;
import com.grupo56.proyectoIngeBackend.model.GenerarAlquilerDTO;
import com.grupo56.proyectoIngeBackend.model.IdAlquilerDTO;
import com.grupo56.proyectoIngeBackend.model.IdSucursalDTO;
import com.grupo56.proyectoIngeBackend.model.PaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.PaqueteExtraDTO;
import com.grupo56.proyectoIngeBackend.model.PatenteDTO;
import com.grupo56.proyectoIngeBackend.model.RequestPaqueteExtraDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.ReservaDTO;
import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.service.AlquilerPaqueteExtraService;
import com.grupo56.proyectoIngeBackend.service.AlquilerService;
import com.grupo56.proyectoIngeBackend.service.ClienteService;
import com.grupo56.proyectoIngeBackend.service.EmpleadoService;
import com.grupo56.proyectoIngeBackend.service.PaqueteExtraService;
import com.grupo56.proyectoIngeBackend.service.ReservaService;

@RestController
public class AlquilerController {
	
	@Autowired
	private AlquilerService service;
	@Autowired
	private ReservaService reservaService;
	@Autowired
	private ClienteService clienteService;
	@Autowired
	private AlquilerPaqueteExtraService alquilerPaqueteExtraService;
	@Autowired
	private PaqueteExtraService paqueteExtraService;
	@Autowired
	private EmpleadoService empleadoService;
	
	@GetMapping("/misAlquileres")
	public ResponseEntity<List<AlquilerDTO>> obetenerMisAlquiler(Authentication authentication) {
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente= clienteService.obtenerPorUsuario(usuario);
        List<Reserva> reservas = reservaService.obtenerReservasPorCliente(cliente);         	
        List<Alquiler> alquileres = service.obtenerAlquilerPorIdReserva(reservas.stream().map(r -> r.getIdReserva()).toList());
        if (alquileres.isEmpty())
        	return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        List<AlquilerPaqueteExtra> alquileresPaquetesExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
		List<AlquilerDTO> alquileresDTO = service.construirAlquileresDTO(alquileres, alquileresPaquetesExtras);
        return ResponseEntity.status(HttpStatus.OK).body(alquileresDTO);
	}
	
	@GetMapping("/empleado/verAlquileres")
	public ResponseEntity<?> obtenerAlquileres(Authentication authentication){
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
		if (usuario.getRol().equals("empleado")) {
			Empleado empleado = empleadoService.obtenerEmpleadoPorIdUsuario(usuario);
			List<Alquiler> alquileres = service.obtenerAlquilerPorIdSucursal(empleado.getSucursal().getIdSucursal());
			if (alquileres.isEmpty())
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("messege", "la sucursal no contiene alquileres"));
			List<AlquilerPaqueteExtra> alquileresPaqueteExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
			List<AlquilerDTO> alquileresDTO = service.construirAlquileresDTO(alquileres, alquileresPaqueteExtras);
			return ResponseEntity.status(HttpStatus.OK).body(Map.of("rol", usuario.getRol(), "alquileres", alquileresDTO));
		}
		else
			return ResponseEntity.status(HttpStatus.OK).body(Map.of("rol", usuario.getRol(), "alquileres", new ArrayList()));
	}
	
	@PostMapping("/admin/verAlquileresPorSucursal")
	public ResponseEntity<?> obtenerAlquileresPorSucursal(@RequestBody IdSucursalDTO request){
		List<Alquiler> alquileres = service.obtenerAlquilerPorIdSucursal(request.idSucursal());
		if (alquileres.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("messege", "la sucursal no contiene alquileres"));
		List<AlquilerPaqueteExtra> alquileresPaqueteExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
		List<AlquilerDTO> alquileresDTO = service.construirAlquileresDTO(alquileres, alquileresPaqueteExtras);
		return ResponseEntity.status(HttpStatus.OK).body(alquileresDTO);
	}
	
	@GetMapping("/empleado/verDevoluciones")
	public ResponseEntity<?> obtenerDevoluciones(Authentication authentication){
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
		if (usuario.getRol().equals("empleado")) {
			Empleado empleado = empleadoService.obtenerEmpleadoPorIdUsuario(usuario);
			List<Alquiler> alquileres = service.obtenerAlquilerPorIdSucursalRegreso(empleado.getSucursal().getIdSucursal());

			List<Alquiler> alquileresFiltrados = alquileres.stream()
					.filter(a -> (a.getFechaRegreso().toLocalDate().equals(LocalDate.now()) || a.getFechaRegreso().toLocalDate().isBefore(LocalDate.now()))
							&& a.getEstado().equals("pendiente"))
							.toList();
			if (alquileresFiltrados.isEmpty())
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("messege", "la sucursal no contiene devolciones"));
			List<AlquilerPaqueteExtra> alquileresPaqueteExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
			List<AlquilerDTO> alquileresDTO = service.construirAlquileresDTO(alquileres, alquileresPaqueteExtras);
			return ResponseEntity.status(HttpStatus.OK).body(Map.of("rol", usuario.getRol(), "alquileres", alquileresDTO));
		}
		else
			return ResponseEntity.status(HttpStatus.OK).body(Map.of("rol", usuario.getRol(), "alquileres", new ArrayList()));
	}
	
	@PostMapping("/admin/verDevolucionesPorSucursal")
	public ResponseEntity<?> obtenerDevolucionesPorSucursal(@RequestBody IdSucursalDTO request){
		List<Alquiler> alquileres = service.obtenerAlquilerPorIdSucursalRegreso(request.idSucursal());
		if (alquileres.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("messege", "la sucursal no contiene devolciones"));
		List<Alquiler> alquileresFiltrados = alquileres.stream()
				.filter(a -> (a.getFechaRegreso().toLocalDate().equals(LocalDate.now()) || a.getFechaRegreso().toLocalDate().isBefore(LocalDate.now()))
						&& a.getEstado().equals("pendiente"))
						.toList();
		if (alquileresFiltrados.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("messege", "la sucursal no contiene devolciones"));
		List<AlquilerPaqueteExtra> alquileresPaqueteExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
		List<AlquilerDTO> alquileresDTO = service.construirAlquileresDTO(alquileres, alquileresPaqueteExtras);
		return ResponseEntity.status(HttpStatus.OK).body(alquileresDTO);
	}
	
	@PostMapping("/admin/verAutosAlquiladosEntreFechas")
	public ResponseEntity<?> obtenerAlquileresEntreFechas(@RequestBody FechasRequestDTO request) {
			List<Alquiler> alquileres = service.obtenerAlquileres();
		    List<AutoAlquiladoDTO> autosAlquiladosDTO = new ArrayList<>();
		    List<AutoDTO> autosDTO = new ArrayList<>();
			if (alquileres.isEmpty())
	        	return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			List<Alquiler> alquileresFiltrados = alquileres.stream()	
					.filter(a -> 
							(request.fechaInicio().isEqual(a.getReserva().getFechaEntrega().toLocalDate()))
							|| request.fechaInicio().isBefore(a.getReserva().getFechaEntrega().toLocalDate())
							&& 
							(request.fechaFin().isEqual(a.getReserva().getFechaEntrega().toLocalDate()) 
							|| request.fechaFin().isAfter(a.getReserva().getFechaEntrega().toLocalDate())))
							.toList();
		        for (Alquiler a : alquileresFiltrados) {
		        	Reserva r = a.getReserva();
		        	AutoPatente aP = r.getAutoPatente();
		        	AutoDTO autoDTO = new AutoDTO(
		                    aP.getAuto().getIdAuto(),
		                    aP.getCategoria().getId(),
		                    aP.getAuto().getMarca(),
		                    aP.getAuto().getModelo(),
		                    aP.getAuto().getPrecioDia(),
		                    aP.getAuto().getCantidadAsientos(),
		                    aP.getCategoria().getDescripcion(),
		                    aP.getAuto().getPoliticaCancelacion().getIdPoliticaCancelacion(),
		                    aP.getAuto().getPoliticaCancelacion().getPorcentaje()
		                );
		        	if (!autosDTO.contains(autosDTO)) {
		        		autosAlquiladosDTO.add(new AutoAlquiladoDTO(autoDTO, 1));
		        		autosDTO.add(autoDTO);
		        	} else {
		            	for (AutoAlquiladoDTO autoAlquiladoDTO : autosAlquiladosDTO) {
							if (autoAlquiladoDTO.getAuto().equals(autoDTO))
								autoAlquiladoDTO.setCantida(autoAlquiladoDTO.getCantida() + 1);
						}
		        	}
				}			
			return ResponseEntity.status(HttpStatus.OK).body(autosAlquiladosDTO);
	}
	
	@GetMapping("/empleado/obternerPaquetesExtras")
	public ResponseEntity<?> obternerPaquetesExtras(){
		List<PaqueteExtra> paquetesExtras = paqueteExtraService.obtenerPaquetesExtras();
		List<PaqueteExtraDTO> paquetesExtrasDTO = new ArrayList();
		for (PaqueteExtra paqueteExtra : paquetesExtras) {
			paquetesExtrasDTO.add(new PaqueteExtraDTO(paqueteExtra.getIdPaquete(), paqueteExtra.getTipoPaquete(), paqueteExtra.getPrecio(), 0));
		}
		return ResponseEntity.status(HttpStatus.OK).body(paquetesExtrasDTO);
	}
	
	@PostMapping("/empleado/registrarAlquiler")
	public ResponseEntity<?> registrarAlquiler(@RequestBody GenerarAlquilerDTO request){
		Reserva reserva = reservaService.obtenerReservaPorId(request.idReserva());
		if (reserva == null || !reserva.getEstado().equals("pendiente"))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "No se encontro una reserva"));
		reserva.setEstado("confirmado");
		reservaService.actualizarReserva(reserva);
		List<Integer> idsPaquetes = request.paquetesExtras().stream().map(p -> p.idPaquete()).toList();
		List<PaqueteExtra> paquetes = paqueteExtraService.obtenerPorIdsPaquetesExtras(idsPaquetes);
		Map<Integer, PaqueteExtra> mapPaquetes = paquetes.stream().collect(Collectors.toMap(p -> p.getIdPaquete(), Function.identity()));
		double total = request.paquetesExtras().stream().mapToDouble(p -> {
			System.out.println(p.cantidad());
			PaqueteExtra paquete = mapPaquetes.get(p.idPaquete());
			return paquete.getPrecio() * p.cantidad();
		})
		.sum();
		System.out.println(total);
		total += reserva.getPrecio();
		Alquiler alquiler = new Alquiler(reserva, reserva.getFechaRegreso() , total, request.dniConductor(), request.dniSegundoConductor());
		service.guardarAlquiler(alquiler);
		for (RequestPaqueteExtraDTO paqueteExtra : request.paquetesExtras()) {
			alquilerPaqueteExtraService
			.guardarAlquilerPaqueteExtra(new AlquilerPaqueteExtra(alquiler, mapPaquetes.get(paqueteExtra.idPaquete()), paqueteExtra.cantidad()));
		}
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(Map.of(
						"message", "Alquiler registrado",
						"idAlquiler", alquiler.getIdAlquiler(),
						"fechaRegreso", alquiler.getFechaRegreso()));
	}
	
	@PostMapping("/empleado/registrarDevolucion")
	public ResponseEntity<?> registrarDevolucion(@RequestBody PatenteDTO request){
		List<Alquiler> alquileres = service.obtenerAlquileres();
		if(alquileres.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		Alquiler alquilerFiltrado = alquileres.stream()
				.filter(a -> a.getReserva().getAutoPatente().getPatente().equals(request.patente()) && a.getEstado().equals("pendiente")).findFirst().orElse(null);
		if(alquilerFiltrado == null)
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "No se enconto un alquiler para esa patente"));
		double precioPorDia = alquilerFiltrado.getReserva().getAutoPatente().getAuto().getPrecioDia();
		alquilerFiltrado.setEstado("finalizado");
		alquilerFiltrado.setPrecio(alquilerFiltrado.getPrecio() + ((int) (ChronoUnit.DAYS.between(LocalDateTime.now(), alquilerFiltrado.getFechaRegreso())) * precioPorDia));
		alquilerFiltrado.setFechaRegreso(LocalDateTime.now());
		service.guardarAlquiler(alquilerFiltrado);
		return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Se registro al devolucion exitosamente"));
	}
	
	@PostMapping("/empleado/verAlquiler")
	public ResponseEntity<?> obtenerAlquiler(@RequestBody IdAlquilerDTO request){
		Alquiler alquiler = service.obtenerAlquilerPorId(request.idAlquiler());
		if (alquiler == null)
			ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("messege", "No hay un alquiler registrad"));
		List<Alquiler> alquileres = new ArrayList<Alquiler>();
		alquileres.add(alquiler);
		List<AlquilerPaqueteExtra> alquileresPaqueteExtras = alquilerPaqueteExtraService.obtenerAlquilerPaquetes();
		List<AlquilerDTO> alquileresDTO = service.construirAlquileresDTO(alquileres, alquileresPaqueteExtras);
		return ResponseEntity.status(HttpStatus.OK).body(Map.of("alquiler", alquileresDTO.get(0), "patente", alquiler.getReserva().getAutoPatente().getPatente()));

	}
}
