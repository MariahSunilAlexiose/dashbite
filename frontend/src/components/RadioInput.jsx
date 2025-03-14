import React from "react"

import PropTypes from "prop-types"

import { Label } from "."

const RadioInput = ({ title, value, selectedValue, onValueChange }) => {
  return (
    <div className="flex cursor-pointer items-center space-x-2">
      <input
        type="radio"
        className="accent-primary"
        value={value}
        onChange={() => onValueChange(value)}
        checked={value === selectedValue}
      />
      <Label htmlFor={title}>{title}</Label>
    </div>
  )
}

RadioInput.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onValueChange: PropTypes.func.isRequired,
}

export default RadioInput
