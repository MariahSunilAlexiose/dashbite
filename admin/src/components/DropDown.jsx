import React, { useEffect, useRef, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const DropDown = ({ options, onChange, defaultValue, label }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (defaultValue && options && options.length > 0) {
      const selectedOption = options.find(
        (option) => option._id === defaultValue
      )
      if (selectedOption) {
        setValue(label === "category" ? selectedOption.name : defaultValue)
        onChange(defaultValue)
      }
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
      className="rounded-md border p-0 shadow-md outline-none"
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <div className="flex h-9 items-center border-b px-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex w-full cursor-pointer items-center rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={value ? "" : "text-muted"}>
              {value || "Select an option..."}
            </span>
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
              {options.length > 0 ? (
                [...options]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((option, index) => (
                    <div
                      key={index}
                      className="hover:bg-accent/40 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => {
                        setOpen(false)
                        onChange(option._id)
                        setValue(option.name)
                      }}
                    >
                      {option.name}
                    </div>
                  ))
              ) : (
                <div className="text-muted py-6 text-center text-sm">
                  No options found...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

DropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
}

export default DropDown
