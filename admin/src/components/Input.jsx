import React from "react"

import { Button } from "@cmp"
import PropTypes from "prop-types"

const Input = ({
  type,
  value,
  name,
  onChange,
  id,
  step,
  min,
  max,
  pattern,
  placeholder = "",
  className,
  icon,
  iconName,
  disabled = false,
}) => {
  return (
    <div className="relative flex w-full items-center">
      {icon && (
        <img src={icon} alt={iconName} className="absolute left-3 h-5 w-5" />
      )}
      <input
        name={name}
        type={type}
        id={id}
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        placeholder={placeholder}
        pattern={pattern}
        className={`${className} border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50`}
        disabled={disabled}
        required
      />
      {icon && (
        <Button variant="ghost" className="absolute right-0.5">
          Apply
        </Button>
      )}
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "number", "email", "tel", "password", "date"])
    .isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pattern: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
  iconName: PropTypes.string,
  disabled: PropTypes.boolean,
}

export default Input
