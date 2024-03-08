import { useState } from "react";

export const Slider = ({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) => {
  const [inValue, setInValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    setInValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={inValue}
        className="neobrutalist-slider"
        onChange={handleChange}
      />
    </div>
  );
};
