package com.grupo56.proyectoIngeBackend.model;

import java.time.*;
import java.time.temporal.*;
import java.util.*;

public class SemanaHelper {

    public static List<LocalDate> obtenerDiasDeSemana(int anio, int numeroSemana) {
        // Usamos la configuración regional (puede ser ISO o Locale.getDefault())
        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        // Lunes de esa semana
        LocalDate lunes = LocalDate.of(anio, 1, 1)
            .with(weekFields.weekOfYear(), numeroSemana)
            .with(weekFields.dayOfWeek(), 1); // 1 = primer día de la semana (usualmente lunes)

        // Lista de lunes a domingo
        List<LocalDate> dias = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            dias.add(lunes.plusDays(i));
        }

        return dias;
    }
}
