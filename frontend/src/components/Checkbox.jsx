import React from "react"

import PropTypes from "prop-types"

import Label from "./Label"

const Checkbox = ({ id, label, checked, setChecked }) => {
  return (
    <div className="flex items-center space-x-3" id={id}>
      <input
        type="checkbox"
        id={id}
        className={`form-checkbox h-4 w-4 ${checked ? "accent-primary" : ""}`}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      {label && (
        <Label htmlFor={id} className="">
          {" "}
          {label}
        </Label>
      )}
    </div>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
}

export default Checkbox
