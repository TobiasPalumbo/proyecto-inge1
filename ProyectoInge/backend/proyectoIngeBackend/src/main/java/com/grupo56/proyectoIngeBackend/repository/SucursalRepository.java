package com.grupo56.proyectoIngeBackend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grupo56.proyectoIngeBackend.model.AutoDTO;
import com.grupo56.proyectoIngeBackend.model.Sucursal;
@Repository
public interface SucursalRepository extends JpaRepository<Sucursal,Integer>{
	
}
