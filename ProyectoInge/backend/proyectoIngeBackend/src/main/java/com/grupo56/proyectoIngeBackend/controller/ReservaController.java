package com.grupo56.proyectoIngeBackend.controller;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerDTO;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesAdminDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesDTO;
import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.Empleado;
import com.grupo56.proyectoIngeBackend.model.GananciaDiariaDTO;
import com.grupo56.proyectoIngeBackend.model.GananciaSemanalDTO;
import com.grupo56.proyectoIngeBackend.model.IdReservaDTO;
import com.grupo56.proyectoIngeBackend.model.IdSucursalDTO;
import com.grupo56.proyectoIngeBackend.model.RequestSucursalFechaDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.ReservaDTO;
import com.grupo56.proyectoIngeBackend.model.SecurityUser;
import com.grupo56.proyectoIngeBackend.model.SemanaDTO;
import com.grupo56.proyectoIngeBackend.model.SemanaHelper;
import com.grupo56.proyectoIngeBackend.model.Tarjeta;
import com.grupo56.proyectoIngeBackend.model.Usuario;
import com.grupo56.proyectoIngeBackend.repository.AlquilerRepository;
import com.grupo56.proyectoIngeBackend.service.AlquilerService;
import com.grupo56.proyectoIngeBackend.service.ClienteService;
import com.grupo56.proyectoIngeBackend.service.EmpleadoService;
import com.grupo56.proyectoIngeBackend.service.ReservaService;
import com.grupo56.proyectoIngeBackend.service.TarjetaService;


@RestController
public class ReservaController {
	
	@Autowired
	private ReservaService service;
	@Autowired
	private ClienteService clienteService;
	@Autowired 
	private TarjetaService tarjetaService;
	@Autowired
	private AlquilerService alquilerService;
	@Autowired
	private EmpleadoService empleadoService;
	
	
	@PostMapping("/public/autosDisponibles")
	public ResponseEntity<List<AutoPatentesDTO>> obtenerAutosDisponibles(@RequestBody RequestSucursalFechaDTO request){
		List<AutoPatentesDTO> response = service.obtenerAutosDisponibles(request);
		if (response.isEmpty()) 
			return ResponseEntity.noContent().build();;
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	@GetMapping("/admin/autosPatentes")
	public ResponseEntity<List<AutoPatentesAdminDTO>> obtenerAutosPatentes(){
		List<AutoPatentesAdminDTO> response = service.obtenerAutosPatentes();
		if (response.isEmpty()) 
			return ResponseEntity.noContent().build();;
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	@GetMapping("/misReservas")
	public ResponseEntity<List<ReservaDTO>> obtenerReservas(Authentication authentication){
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente= clienteService.obtenerPorUsuario(usuario);
        List<Reserva> reservas= service.obtenerReservasPorCliente(cliente);
        if(reservas.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        List<ReservaDTO> reservasDTO = new ArrayList<ReservaDTO>();
        reservas.stream().forEach(r -> 
        reservasDTO.add(new ReservaDTO(
            r.getIdReserva(),
            r.getSucursalEntrega(),
            r.getSucursalRegreso(),
            new AutoDTO(
                r.getAutoPatente().getAuto().getIdAuto(),
                r.getAutoPatente().getCategoria().getId(),
                r.getAutoPatente().getAuto().getMarca(),
                r.getAutoPatente().getAuto().getModelo(),
                r.getAutoPatente().getAuto().getPrecioDia(),
                r.getAutoPatente().getAuto().getCantidadAsientos(),
                r.getAutoPatente().getCategoria().getDescripcion(),
                r.getAutoPatente().getAuto().getPoliticaCancelacion().getIdPoliticaCancelacion(),
                r.getAutoPatente().getAuto().getPoliticaCancelacion().getPorcentaje()
            ),
            r.getPrecio(),
            r.getEstado(),
            r.getFechaEntrega().toLocalDate(),
            r.getFechaRegreso().toLocalDate(),
            r.getFechaEntrega().toLocalTime(),
            r.getFechaRegreso().toLocalTime()
        ))
    );
        return ResponseEntity.status(HttpStatus.OK).body(reservasDTO);
	}
	
	@PostMapping("/cancelarReserva")
    public ResponseEntity<?> cancelarReserva(@RequestBody IdReservaDTO Reserva, Authentication authentication){
        Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
        Cliente cliente = clienteService.obtenerPorUsuario(usuario);

        if (Reserva == null || Reserva.idReserva() == null || Reserva.idReserva() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "El código de reserva no es válido."));
        }

         Reserva reserva = service.obtenerReservaPorId(Reserva.idReserva());

        if(reserva != null && service.reservaPerteneceAusuario(reserva, cliente)){
            if (reserva.getFechaEntrega().toLocalDate().isBefore(LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "El tiempo de cancelacion expiro"));
            }

            if ("cancelado".equals(reserva.getEstado())) {
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "La reserva ya está cancelada."));
            }
            
            reserva.setEstado("cancelado");
            service.actualizarReserva(reserva);

            double devolucionPorcentaje  = reserva.getAutoPatente().getAuto().getPoliticaCancelacion().getPorcentaje();
            Tarjeta tarjeta = reserva.getTarjeta();
            tarjeta.setMonto(reserva.getTarjeta().getMonto() + reserva.getPrecio() * devolucionPorcentaje);
            tarjetaService.subirTarjeta(tarjeta);

            String mensajeExito = "Reserva cancelada, se reintegro el " + (devolucionPorcentaje * 100)  + "% del precio de la reserva";
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", mensajeExito));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No es tu reserva o el código es inválido."));
    }
	
	@PostMapping("/empleado/verReservasSucursal")
	public ResponseEntity<List<ReservaDTO>> obtenerReservasSucursal(@RequestBody IdSucursalDTO idSucursalDTO){
		List<ReservaDTO> reservasDTO = service.obtenerReservasDeSucursal(idSucursalDTO.idSucursal());
		if(reservasDTO.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		return ResponseEntity.status(HttpStatus.OK).body(reservasDTO);
	}
	
	
	@GetMapping("/empleado/verEntregas")
	public ResponseEntity<?> obtenerEntregas(Authentication authentication) {
		Usuario usuario = ((SecurityUser) authentication.getPrincipal()).getUsuario();
		if (usuario.getRol().equals("empleado")) {
			Empleado empleado = empleadoService.obtenerEmpleadoPorIdUsuario(usuario);
			List<ReservaDTO> reservasDTO = service.obtenerReservasDeSucursalEntrega(empleado.getSucursal().getIdSucursal());
			if(reservasDTO.isEmpty())
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			List<ReservaDTO> reservasDTOfitradas = reservasDTO.stream()
																.filter(r -> r.fechaEntrega().isEqual(LocalDate.now()) && r.estado().equals("pendiente"))
																.toList();
			return ResponseEntity.status(HttpStatus.OK).body(Map.of("rol", usuario.getRol(), "reservas", reservasDTOfitradas));
		}
		else
			return ResponseEntity.status(HttpStatus.OK).body(Map.of("rol", usuario.getRol(), "reservas", new ArrayList()));
	}
	
	@PostMapping("/admin/verEntregasPorSucursal")
	public ResponseEntity<List<ReservaDTO>> obtenerEntregasPorSucursal(@RequestBody IdSucursalDTO idSucursalDTO) {
		List<ReservaDTO> reservasDTO = service.obtenerReservasDeSucursalEntrega(idSucursalDTO.idSucursal());
		if(reservasDTO.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		List<ReservaDTO> reservasDTOfitradas = reservasDTO.stream()
															.filter(r -> r.fechaEntrega().isEqual(LocalDate.now()) && r.estado().equals("pendiente"))
															.toList();
		return ResponseEntity.status(HttpStatus.OK).body(reservasDTOfitradas);
	}

	@PostMapping("/empleado/cancelarReservaAdminEmpleado")
	public ResponseEntity<?> cancelarReserva(@RequestBody IdReservaDTO request){
		Reserva reserva= service.obtenerReservaPorId(request.idReserva());
		if(reserva.getEstado().equals("cancelado")|| alquilerService.existsByReserva(reserva)|| reserva.getEstado().equals("anulado"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "La reserva ya esta cancelada o le correspone un alquiler en curso"));
		reserva.setEstado("cancelado");
		service.actualizarReserva(reserva);
		double devolucionPorcentaje  = reserva.getAutoPatente().getAuto().getPoliticaCancelacion().getPorcentaje();
        Tarjeta tarjeta = reserva.getTarjeta();
        tarjeta.setMonto(reserva.getTarjeta().getMonto() + reserva.getPrecio() * devolucionPorcentaje);
        tarjetaService.subirTarjeta(tarjeta);
        String mensajeExito = "Reserva cancelada, se reintegro el " + (devolucionPorcentaje * 100)  + "% del precio de la reserva";
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", mensajeExito));
	}
	@PostMapping("/empleado/anularReservaAdminEmpleado")
	public ResponseEntity<?> anularReserva(@RequestBody IdReservaDTO request){
		Reserva reserva= service.obtenerReservaPorId(request.idReserva());
		if(reserva.getEstado().equals("anulado")|| reserva.getEstado().equals("cancelada"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "La reserva ya esta anulada o cancelada"));
		reserva.setEstado("anulado");
		service.actualizarReserva(reserva);
        Tarjeta tarjeta = reserva.getTarjeta();
        tarjeta.setMonto(reserva.getTarjeta().getMonto() + reserva.getPrecio());
        tarjetaService.subirTarjeta(tarjeta);
        String mensajeExito = "Reserva anulada se dovolvio la totalidad del monto";
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", mensajeExito));
	}
	
	@PostMapping("/admin/verGananciasSemanales")
	public ResponseEntity<?> obtenerGananciasSemanales(@RequestBody SemanaDTO request){
		List<Reserva> reservas = service.obtenerReservasDeSemana(request.dia());
		List<Alquiler> alquileres = alquilerService.obtenerAlquieresDeSemana(request.dia());
		if (reservas.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "No hay reservas registradas para esa semana"));	
		WeekFields semanaEstandar = WeekFields.of(DayOfWeek.MONDAY, 1);
		int semana = request.dia().get(semanaEstandar.weekOfYear());
		SemanaHelper creadorSemana = new SemanaHelper();
		List<GananciaDiariaDTO> gananciasDiariasDTO = new ArrayList();
		List<LocalDate> dias = creadorSemana.obtenerDiasDeSemana(request.dia().getYear(), semana);
		Map<LocalDate, Double> diaMap = dias.stream().collect(Collectors.toMap(d -> d, d -> 0.0));
		double total = 0;
		double ganancia = 0;
		for (Reserva reserva : reservas) {
			if (reserva.getEstado().equals("cancelado"))
				ganancia = reserva.getPrecio() * reserva.getAutoPatente().getAuto().getPoliticaCancelacion().getPorcentaje();
			else if (reserva.getEstado().equals("pendiente") || reserva.getEstado().equals("vencido"))
				ganancia = reserva.getPrecio();
			LocalDate fechaPago = reserva.getFechaDePago().toLocalDate();
			
			if (diaMap.containsKey(fechaPago)) 
			    diaMap.replace(fechaPago, diaMap.get(fechaPago) + ganancia);
			else 
			    diaMap.put(fechaPago, ganancia);
			
			total+= ganancia;
		}
		
		for (Alquiler alquiler : alquileres) {
			if (alquiler.getPrecio() > alquiler.getReserva().getPrecio()) {
				double diferencia = alquiler.getPrecio() - alquiler.getReserva().getPrecio();
				LocalDate fechaEntrega = alquiler.getReserva().getFechaEntrega().toLocalDate();
				if (diaMap.containsKey(fechaEntrega)) 
				    diaMap.replace(fechaEntrega, diaMap.get(fechaEntrega) + ganancia);
				else 
				    diaMap.put(fechaEntrega, ganancia);
				total+= diferencia;
			}		
		}
		
		for (Map.Entry<LocalDate, Double> entry : diaMap.entrySet()) {
			gananciasDiariasDTO.add(new GananciaDiariaDTO(entry.getKey(), entry.getValue()));
		}

		GananciaSemanalDTO gananciaSemanalDTO = new GananciaSemanalDTO(semana, request.dia(), total, gananciasDiariasDTO);
		return ResponseEntity.status(HttpStatus.OK).body(gananciaSemanalDTO);
	}
}
