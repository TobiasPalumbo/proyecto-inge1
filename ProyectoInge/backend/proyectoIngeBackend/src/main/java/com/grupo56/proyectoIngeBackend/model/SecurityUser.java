package com.grupo56.proyectoIngeBackend.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class SecurityUser implements UserDetails{
	private Usuario usuario;
	
	@Override
	public Collection <? extends GrantedAuthority> getAuthorities(){
		return Collections.singletonList(new SimpleGrantedAuthority(usuario.getRol()));
		
	}
	@Override
	public String getPassword() {
		return usuario.getContraseña();
	}
	@Override
	public String getUsername() {
		return usuario.getCorreo();
	}
	public SecurityUser(Usuario usuario) {
		super();
		this.usuario = usuario;
	}
	public Usuario getUsuario() {
		return this.usuario;
	}
	
}
