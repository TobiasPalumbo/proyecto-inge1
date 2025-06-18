package com.grupo56.proyectoIngeBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.Alquiler;
import com.grupo56.proyectoIngeBackend.model.AlquilerPaqueteExtra;
import com.grupo56.proyectoIngeBackend.model.Reserva;
import com.grupo56.proyectoIngeBackend.model.Sucursal;

@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Integer> {
	
	List<Alquiler> findByReservaIdReservaIn(List<Integer> idReservas);
	
	boolean existsByReserva(Reserva reserva);
	
	@Query("""
		    SELECT COUNT(a) > 0
		    FROM Alquiler a
		    WHERE a.estado = 'pendiente'
		    AND a.reserva.estado = 'confirmado'
		    AND a.reserva.autoPatente.idAutoPatente = :autoId
		""")
		boolean existsAlquilerPendientePorAuto(Integer autoId);


}
