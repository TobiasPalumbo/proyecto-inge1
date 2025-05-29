package com.grupo56.proyectoIngeBackend.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.grupo56.proyectoIngeBackend.model.Tarjeta;
@Repository
public interface TarjetaRepository extends JpaRepository<Tarjeta, Integer> {
	
	@Query("SELECT t FROM Tarjeta t "
			+ "WHERE t.numero = :numero "
			+ "AND t.CVV = :CVV "
			+ "AND t.fechaVencimiento = :fechaVencimiento"
			+ "AND t.nombreTitular = :nombreTitular "
			)
	public Tarjeta obtenerTarjetaPorNumero(@Param("numero") String numero, @Param("CVV") String CVV, @Param("fechaVencimiento") LocalDate fechaVencimiento, @Param("nombreTitular") String nombreTitular);
}
