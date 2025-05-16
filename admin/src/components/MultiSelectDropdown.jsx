import React, { useEffect, useRef, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const MultiSelectDropDown = ({ options, onChange, defaultValue = [] }) => {
  const dropdownRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    if (defaultValue.length && options.length) {
      const updatedSelectedOptions = options.filter((option) =>
        defaultValue.includes(option._id)
      )

      setSelectedOptions((prev) => {
        const prevIds = prev
          .map((opt) => opt._id)
          .sort()
          .join(",")
        const newIds = updatedSelectedOptions
          .map((opt) => opt._id)
          .sort()
          .join(",")

        return prevIds !== newIds ? updatedSelectedOptions : prev
      })
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

  useEffect(() => {
    onChange(selectedOptions.map((opt) => opt._id))
  }, [selectedOptions])

  const handleSelect = (option) => {
    setSelectedOptions((prevSelected) => {
      const isSelected = prevSelected.some((opt) => opt._id === option._id)
      const updatedSelected = isSelected
        ? prevSelected.filter((opt) => opt._id !== option._id)
        : [...prevSelected, option]

      const prevIds = prevSelected
        .map((opt) => opt._id)
        .sort()
        .join(",")
      const newIds = updatedSelected
        .map((opt) => opt._id)
        .sort()
        .join(",")

      return prevIds !== newIds ? updatedSelected : prevSelected
    })
  }

  return (
    <div
      ref={dropdownRef}
      className="rounded-md border p-0 shadow-md outline-none"
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <div className="flex items-center border-b px-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex w-full items-center gap-2 border-b py-2"
          >
            <div className="flex flex-grow flex-wrap items-center gap-2">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option, index) => (
                  <div
                    key={option._id || `${option.name}-${index}`}
                    className="bg-blue-40 flex items-center rounded-md px-3 py-1 text-sm text-white"
                  >
                    {option.name}
                    <button
                      className="ml-2 text-white hover:text-gray-200"
                      onClick={() => handleSelect(option)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="flex-grow text-sm text-gray-400">
                  Search an option...
                </p>
              )}
            </div>
            <div className="ml-auto">
              <img
                src={ChevronUpDownIcon}
                alt="Chevron Up Down Icon"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
        {open && (
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <div className="overflow-hidden p-1">
              {options && options.length ? (
                options.map((option) => (
                  <div
                    key={option._id}
                    className={`hover:bg-border relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none ${
                      selectedOptions.some(
                        (selected) => selected._id === option._id
                      )
                        ? "bg-blue-40 text-white"
                        : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.name}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm">
                  No options found.
                </div>
              )}
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
