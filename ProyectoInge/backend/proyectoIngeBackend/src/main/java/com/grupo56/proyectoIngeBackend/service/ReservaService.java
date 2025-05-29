package com.grupo56.proyectoIngeBackend.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.grupo56.proyectoIngeBackend.model.AutoAdminDTO;
import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesAdminDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatentesDTO;
import com.grupo56.proyectoIngeBackend.model.Cliente;
import com.grupo56.proyectoIngeBackend.model.RequestSucursalFechaDTO;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.ReservaDTO;
import com.grupo56.proyectoIngeBackend.model.ReservaRequestDTO;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
import com.grupo56.proyectoIngeBackend.repository.ReservaRepository;

@Service
public class ReservaService {
	
	@Autowired
	ReservaRepository repository;
	@Autowired
	AutoPatenteService autoPatenteService;
	@Autowired
	SucursalService sucursalService;
	@Autowired
	ClienteService clienteService;
	
	

	public List<Reserva> obtenerReservaDeSucursal(Sucursal sucursal){
		return repository.findBySucursalEntrega(sucursal);
	}
	
	public List<AutoPatente> autosPatentesNoReservados(List<AutoPatente> autosPatentes, Integer idSucursal){
		return repository.autosPatentesNoReservados(autosPatentes, idSucursal);
	}
	public List<AutoPatente> autosPatenteDiponibles(LocalDateTime fechaEntrega, LocalDateTime fechaRegreso, Integer idSucursal){
		return repository.autosPatenteDiponibles(fechaEntrega, fechaRegreso, idSucursal);
	}
	
	public List<AutoDTO> autosDTODisponibles(List<AutoPatente> autosPatentesDisiponibles) {		
		return repository.autosDTODisponibles(autosPatentesDisiponibles.stream().map(p -> p.getPatente()).toList());
	}
	
	public List<AutoPatentesDTO> obtenerAutosDisponibles(RequestSucursalFechaDTO request){
		List<AutoPatente> autosPatentesDisponibles = autosPatenteDiponibles(request.fechaEntrega().atStartOfDay(), request.fechaRegreso().atTime(LocalTime.MAX), request.sucursal());
		List<AutoDTO> autosDTOSDisponibles = autosDTODisponibles(autosPatentesDisponibles);
		System.out.print(autosDTOSDisponibles.size());
		List<AutoPatentesDTO> autoPatentesDTO = new ArrayList<AutoPatentesDTO>();
		autosDTOSDisponibles.stream().forEach(dto -> autoPatentesDTO.add(new AutoPatentesDTO(dto, new ArrayList<String>())));	
		for (AutoPatente p : autosPatentesDisponibles) {
		    for (AutoPatentesDTO dto : autoPatentesDTO) {
		        if (dto.autoDTO().idAuto().equals(p.getAuto().getIdAuto()) &&
		            dto.autoDTO().idCategoria().equals(p.getCategoria().getId())) {
		            dto.patentes().add(p.getPatente());	
		            break;	
		        }
		    }
		}
		return autoPatentesDTO;
	}
	
	public List<AutoPatentesAdminDTO> obtenerAutosPatentes(){
		List<AutoPatente> autosPatentes= autoPatenteService.obtenerAutosPatente();
		List<AutoAdminDTO> autoAdminDTO= repository.autosAdminDTO();
		List<AutoPatentesAdminDTO> autoPatentesAdminDTO= new ArrayList<AutoPatentesAdminDTO>();
		autoAdminDTO.stream().forEach(dto -> autoPatentesAdminDTO.add(new AutoPatentesAdminDTO (dto,new ArrayList<String>())));
		for(AutoPatente p : autosPatentes ) {
			for(AutoPatentesAdminDTO dto : autoPatentesAdminDTO){
				if(dto.autoAdminDTO().idAuto().equals(p.getAuto().getIdAuto())&&
				   dto.autoAdminDTO().idCategoria().equals(p.getCategoria().getId())) {
					dto.patentes().add(p.getPatente());
					break;
				}
			}
		}	
		return autoPatentesAdminDTO;
	}
	
	public void subirReserva(ReservaRequestDTO request,Cliente cliente, double monto){
		Reserva reserva= new Reserva();
		List<String> patentes= request.patentes();
		reserva.setAutoPatente(autoPatenteService.obtenerAutoPatentePorPatente(patentes.getFirst()));
		reserva.setCliente(cliente);
		reserva.setSucursalEntrega(reserva.getAutoPatente().getSucursal());
		reserva.setSucursalRegreso(sucursalService.obtenerSucursalPorId(request.sucursalEntregaId()));
		reserva.setFechaEntrega(LocalDateTime.of(request.fechaEntrega(), request.horaEntrega()));
		reserva.setFechaRegreso(LocalDateTime.of(request.fechaRegreso(), request.horaRegreso()));
		reserva.setPrecio(monto);
		repository.save(reserva);
	}
	public void actualizarReserva(Reserva reserva) {
		repository.save(reserva);
	}
	public List<Reserva> obtenerReservasPorCliente(Cliente cliente){
		
		return repository.findAllByCliente(cliente);
		
	}
	public Reserva obtenerReservaPorId(Integer id) {
		Optional<Reserva> reserva= repository.findById(id);
		if(reserva.isPresent())
			return reserva.get();
		return null;
	}
	
	public boolean reservaPerteneceAusuario(Reserva reserva, Cliente cliente ) {
		List<Reserva> reservas= repository.findAllByCliente(cliente);
		if(!reservas.isEmpty()) {
			return reservas.contains(reserva);}
		return false;
	}
	public List<ReservaDTO> obtenerReservasDeSucursal(Integer idSucursal){
	    List<ReservaDTO> reservasDTO = new ArrayList<ReservaDTO>();
	    List<Reserva> reservas = repository.reservasSucursalId(idSucursal);    
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
            r.getEstado(),
            r.getFechaEntrega().toLocalDate(),
            r.getFechaRegreso().toLocalDate(),
            r.getFechaEntrega().toLocalTime(),
            r.getFechaRegreso().toLocalTime()
        ))
    );
		return reservasDTO;
		
		
	}
	
	
}
