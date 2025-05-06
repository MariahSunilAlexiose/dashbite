import React, { useEffect, useState } from "react"

import { ChevronUpDownIcon } from "@icons"
import PropTypes from "prop-types"

const DropDown = ({
  options,
  onChange,
  defaultValue = "Select an option...",
  label,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)

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

  return (
    <div className="bg-popover text-popover-foreground rounded-md border p-0 shadow-md outline-none">
      <div className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
        <div className="flex items-center border-b px-3">
          <div
            onClick={() => setOpen(!open)}
            className="placeholder:text-muted-foreground flex h-10 w-full cursor-pointer items-center rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {value}
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
                  className="hover:bg-accent/40 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => {
                    setOpen(false)
                    onChange(option._id)
                    setValue(option.name)
                  }}
                >
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

DropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
}

export default DropDown
