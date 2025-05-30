import React, { useEffect, useRef, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const InputDropDown = ({
  options,
  className,
  onChange,
  defaultValue,
  disabled,
}) => {
  const dropdownRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (defaultValue && options.length) {
      const selectedOption = options.find(
        (option) => option._id === defaultValue
      )
      setSearchTerm(selectedOption ? selectedOption.name : "")
    }
  }, [defaultValue, options])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={dropdownRef}
      className={`rounded-md border p-0 shadow-md outline-none ${className}`}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <div className="flex h-9 items-center border-b px-3">
          <input
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
            value={searchTerm}
            className="placeholder:text-muted flex h-5 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search option..."
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
          />
          <img
            src={ChevronUpDownIcon}
            alt="Chevron Up Down Icon"
            width={20}
            height={20}
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          {open && options && (
            <div className="overflow-hidden p-1">
              {options
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter(
                  (option) =>
                    option.name &&
                    option.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((option, index) => (
                  <div
                    key={index}
                    className="hover:bg-accent relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      setSearchTerm(option.name)
                      setOpen(false)
                      onChange(option._id)
                    }}
                  >
                    {option.name}
                  </div>
                ))}
              {options.filter(
                (option) =>
                  option.name &&
                  option.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-muted py-6 text-center text-sm">
                  No options found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

InputDropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      restaurantID: PropTypes.number,
      supplierID: PropTypes.number,
      inventoryID: PropTypes.number,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.boolean,
}

export default InputDropDown
