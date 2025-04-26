import React, { useEffect, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const InputDropDown = ({ options, className, onChange, defaultValue }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (defaultValue) {
      setSearchTerm(defaultValue)
    }
  }, [defaultValue])

  return (
    <div
      className={`bg-popover text-popover-foreground rounded-md border p-0 shadow-md outline-none ${className}`}
    >
      <div className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
        <div className="flex items-center border-b px-3">
          <input
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
            value={searchTerm}
            className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search option..."
            onChange={(e) => setSearchTerm(e.target.value)}
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
                .filter(
                  (option) =>
                    option.name &&
                    option.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((option, index) => (
                  <div
                    key={index}
                    className="hover:bg-accent/40 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50"
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
                <div className="py-6 text-center text-sm">No option found.</div>
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
}

export default InputDropDown
