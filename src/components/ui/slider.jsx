import { useState } from "react";

export function Slider({ min, max, step, value, onValueChange }) {
  const [internalValue, setInternalValue] = useState(value[0]);

  const handleChange = (e) => {
    setInternalValue(Number(e.target.value));
    onValueChange([Number(e.target.value)]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={internalValue}
      onChange={handleChange}
      className="w-full cursor-pointer"
    />
  );
}

