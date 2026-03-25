import type { ChangeEvent } from "react";

interface InputFieldProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function InputField({ placeholder, className, value, onChange, disabled }: InputFieldProps) {
  return (
    <input
      type="text"
      className={` border-[#052698] border-[0.45px] px-4 py-2 text-[#545454] bg-white disabled:opacity-50 ${className}`}
      placeholder={
        placeholder ??
        "Input your Bill of Lading or Container Number to Begin tracking"
      }
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default InputField;
