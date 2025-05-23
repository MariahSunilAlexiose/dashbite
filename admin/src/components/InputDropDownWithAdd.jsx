import React, { useEffect, useRef, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const InputDropdownWithAdd = ({
  options,
  setOptions,
  onChange,
  defaultValue = [],
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOptions, setSelectedOptions] = useState(defaultValue)
  const dropdownRef = useRef(null) // Reference for dropdown

  useEffect(() => {
    if (defaultValue.length > 0) setSelectedOptions(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectOption = (optionName) => {
    setSelectedOptions((prev) =>
      prev.includes(optionName)
        ? prev.filter((name) => name !== optionName)
        : [...prev, optionName]
    )
    onChange(
      selectedOptions.includes(optionName)
        ? selectedOptions.filter((name) => name !== optionName)
        : [...selectedOptions, optionName]
    )
  }

  return (
    <div
      ref={dropdownRef}
      className="rounded-md border p-0 shadow-md outline-none"
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
        {/* Selected options displayed as separate boxes */}
        <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
          {selectedOptions.map((option) => {
            return option ? (
              <div
                key={option}
                className="bg-blue-40 flex items-center rounded-md px-3 py-1 text-sm text-white"
              >
                {option}
                <button
                  className="ml-2 text-white hover:text-gray-200"
                  onClick={() => handleSelectOption(option)}
                >
                  ✕
                </button>
              </div>
            ) : null
          })}
          <input
            className="placeholder:text-muted-foreground flex-1 bg-transparent py-1 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search or add an option..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchTerm.trim()) {
                const newOption = searchTerm
                setOptions([...options, newOption])
                setSelectedOptions([...selectedOptions, newOption])
                setSearchTerm("")
                setOpen(false)
                onChange([...selectedOptions, newOption])
              }
            }}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
            disabled={disabled}
          />
          <img
            src={ChevronUpDownIcon}
            alt="Chevron Up Down Icon"
            width={20}
            height={20}
            className="ml-auto"
          />
        </div>

        {/* Dropdown options */}
        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          {open && options && (
            <div className="overflow-hidden p-1">
              {options
                .sort((a, b) => a.localeCompare(b))
                .map((option) => (
                  <div
                    key={option}
                    className={`hover:bg-border relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none ${
                      selectedOptions.includes(option)
                        ? "bg-blue-40 text-white"
                        : ""
                    }`}
                    onClick={() => handleSelectOption(option)}
                  >
                    {option}
                  </div>
                ))}
              {options.length === 0 && (
                <div className="py-6 text-center text-sm">
                  No options found. Press **Enter** to add.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// PropTypes validation
InputDropdownWithAdd.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
}

export default InputDropdownWithAdd
