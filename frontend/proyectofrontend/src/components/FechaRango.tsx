"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { useEffect, useState } from "react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type Props = {
  value: Range;
  onChange: (range: Range) => void;
};

export default function FechaRango({ value, onChange }: Props) {
  const [range, setRange] = useState([value]);

  useEffect(() => {
    setRange([value]);
  }, [value]);

  return (
    <DateRange
      editableDateInputs={true}
      moveRangeOnFirstSelection={false}
      onChange={(item: RangeKeyDict) => {
        const selected = item.selection;
        if (selected?.startDate && selected?.endDate) {
          setRange([selected]);
          onChange(selected); // Pasamos todo el objeto Range
        }
      }}
      ranges={range}
      rangeColors={["#78350f"]} // amber-900
    />
  );
}
