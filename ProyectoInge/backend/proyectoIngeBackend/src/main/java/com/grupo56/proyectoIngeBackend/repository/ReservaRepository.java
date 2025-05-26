package com.grupo56.proyectoIngeBackend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.AutoPatente;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
	
	public List<Reserva> findBySucursal(Sucursal sucursal);
	
	@Query("SELECT aP FROM AutoPatente aP WHERE aP.sucursal = :idSucursal AND aP.patente NOT IN :patentes")
	public List<AutoPatente> autosPatentesNoReservados(@Param("patentes") List<AutoPatente> patentes, @Param("idSucursal") Integer idSucursal);
	
	@Query("SELECT aP FROM AutoPatente aP " +
		       "WHERE aP.sucursal.idSucursal = :idSucursal " +
		       "AND aP.patente NOT IN (" +
		       "  SELECT r.autoPatente.patente FROM Reserva r " +
		       "  WHERE (r.fechaEntrega <= :fechaRegreso AND r.fechaRegreso >= :fechaEntrega)" +
		       ")")
		public List<AutoPatente> autosPatenteDiponibles(
		    @Param("fechaEntrega") LocalDate fechaEntrega,
		    @Param("fechaRegreso") LocalDate fechaRegreso,
		    @Param("idSucursal") Integer idSucursal
		);
	
	
	@Query("SELECT DISTINCT new com.grupo56.proyectoIngeBackend.model.AutoDTO(aP.auto.idAuto, aP.categoria.idCategoria, aP.auto.marca, aP.auto.modelo, aP.auto.precioDia, aP.auto.cantidadAsientos, aP.categoria.descripcion)"
			+ " FROM AutoPatente aP WHERE aP.patente IN :autosPatentesDisponibles")
	public List<AutoDTO> autosDTODisponibles(@Param("autosPatentesDisponibles") List<String> autosPatentesDisponibles);
	

}
