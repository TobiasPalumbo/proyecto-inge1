package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name="sucursal")
@NoArgsConstructor
@AllArgsConstructor
public class Sucursal {

		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Integer idSucursal;
		private String localidad;
		private String direccion;
		public Integer getIdSucursal() {
			return idSucursal;
		}
		public void setIdSucursal(Integer idSucursal) {
			this.idSucursal = idSucursal;
		}
		public String getLocalidad() {
			return localidad;
		}
		public void setLocalidad(String localidad) {
			this.localidad = localidad;
		}
		public String getDireccion() {
			return direccion;
		}
		public void setDireccion(String direccion) {
			this.direccion = direccion;
		}
		
}
