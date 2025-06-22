"use client";

import * as React from "react";
import { format } from "date-fns";
import { DayPicker, DateRange, SelectRangeEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
};

export default function FechaRangoNuevo({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className="w-full justify-start text-left font-normal bg-white text-black border border-gray-400"
        >
          {value?.from ? (
            value.to ? (
              `${format(value.from, "dd/MM/yyyy")} - ${format(value.to, "dd/MM/yyyy")}`
            ) : (
              format(value.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Seleccioná un rango de fechas</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white text-black shadow-lg rounded-md">
        <DayPicker
          mode="range"
          selected={value}
          onSelect={onChange as SelectRangeEventHandler}
          numberOfMonths={1}
          pagedNavigation
          className="bg-white"
        />
      </PopoverContent>
          
    </Popover>
  );
}
