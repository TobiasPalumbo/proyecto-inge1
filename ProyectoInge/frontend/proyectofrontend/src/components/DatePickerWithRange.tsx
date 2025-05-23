"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// ESTA ES LA INTERFAZ CORRECTA PARA QUE EL PADRE CONTROLE LAS FECHAS
interface DatePickerWithRangeProps {
  value: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}

export function DatePickerWithRange({
  value,    // <--- RECIBE 'value' como prop
  onSelect, // <--- RECIBE 'onSelect' como prop
  className,
}: DatePickerWithRangeProps) { // <--- USA LA INTERFAZ CORRECTA
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal **bg-white**", // Asegura que el botón tenga fondo blanco
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" /> {/* Añadí margin al icono */}
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Elegí una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        {/* Asegura un z-index alto para que el PopoverContent se vea */}
        <PopoverContent className="w-auto p-0 **z-50 bg-white**" align="start"> {/* Añadí z-50 y bg-white */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}    // <--- USA LA PROP 'value'
            onSelect={onSelect} // <--- USA LA PROP 'onSelect'
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}