package com.grupo56.proyectoIngeBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "empleado")
public class Empleado {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_empleado")
	private Integer id_empleado;
	@OneToOne
	@JoinColumn(name = "idUsuario")
	private Usuario usuario;
	private String nombre;
	private String apellido;
	private Integer dni;
	@ManyToOne
	@JoinColumn(name = "idSucursal")
	private Sucursal idSucursal;
	private boolean borrado=false;
	
	
	public boolean isBorrado() {
		return borrado;
	}
	public void setBorrado(boolean borrado) {
		this.borrado = borrado;
	}
	public Sucursal getIdSucursal() {
		return idSucursal;
	}
	public void setIdSucursal(Sucursal idSucursal) {
		this.idSucursal = idSucursal;
	}
	public Integer getId_empleado() {
		return id_empleado;
	}
	public void setId_empleado(Integer id_empleado) {
		this.id_empleado = id_empleado;
	}
	public Usuario getUsuario() {
		return usuario;
	}
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getApellido() {
		return apellido;
	}
	public void setApellido(String apellido) {
		this.apellido = apellido;
	}
	public Integer getDni() {
		return dni;
	}
	public void setDni(Integer dni) {
		this.dni = dni;
	}
	
}
