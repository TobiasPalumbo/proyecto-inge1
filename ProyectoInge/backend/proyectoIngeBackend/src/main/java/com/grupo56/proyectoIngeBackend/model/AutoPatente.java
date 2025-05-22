package com.grupo56.proyectoIngeBackend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="auto_patente")
public class AutoPatente {
	@Id
	@Column(length = 20)
	private String patente;
	@JoinColumn(name = "idAuto")
	@ManyToOne
	private Auto auto;
	@ManyToOne
	@JoinColumn(name = "idSucursal")
	private Sucursal idSucursal;
	@ManyToOne
	@JoinColumn(name = "idPoliticaCancelacion")
	private PoliticaCancelacion politicaCancelacion;
	private LocalDate anio;
	private boolean borrado = false;
	
	public String getPatente() {
		return patente;
	}
}
