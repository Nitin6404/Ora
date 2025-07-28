import React, { useState } from "react";
import PropTypes from "prop-types";
import "../pages/patient.css"

const CustomInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm md:text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div
        className={`input-wrapper ${
          error ? "error" : isFocused ? "focused" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="input-field"
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

CustomInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CustomInput;
