import React, { useEffect, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const MultiSelectDropDown = ({ options, onChange, defaultValue = [] }) => {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState(defaultValue)

  useEffect(() => {
    if (defaultValue.length && options?.length) {
      const selectedOptions = options.filter((option) =>
        defaultValue.includes(option._id)
      )
      setSelectedValues(selectedOptions.map((opt) => opt.name))
      onChange(defaultValue)
    }
  }, [defaultValue, options])

  const handleSelect = (option) => {
    const newSelected = selectedValues.includes(option.name)
      ? selectedValues.filter((val) => val !== option.name)
      : [...selectedValues, option.name]

    setSelectedValues(newSelected)
    onChange(
      options
        .filter((opt) => newSelected.includes(opt.name))
        .map((opt) => opt._id)
    )
  }

  return (
    <div className="bg-popover text-popover-foreground rounded-md border p-0 shadow-md outline-none">
      <div className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
        <div className="flex items-center border-b px-3">
          <div
            onClick={() => setOpen(!open)}
            className="placeholder:text-muted-foreground flex h-10 w-full cursor-pointer items-center rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedValues.length > 0
              ? selectedValues.join(", ")
              : "Select options..."}
            <img
              src={ChevronUpDownIcon}
              alt="Chevron Up Down Icon"
              width={20}
              height={20}
              className="ml-auto"
            />
          </div>
        </div>
        {open && (
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <div className="overflow-hidden p-1">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`hover:bg-accent/40 relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50 ${
                    selectedValues.includes(option.name) ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.name)}
                    className="mr-2"
                    readOnly
                  />
                  {option.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

MultiSelectDropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.arrayOf(PropTypes.string),
}

export default MultiSelectDropDown
