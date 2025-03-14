import React from "react"

import { Button } from "@cmp"

const Input = ({ type, placeholder, className, icon, iconName }) => {
  return (
    <div className="relative flex w-full items-center">
      {icon && (
        <img src={icon} alt={iconName} className="absolute left-3 h-5 w-5" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`${className} ${icon && "pl-9"} placeholder:text-muted focus-visible:ring-primary border-blue-30 dark:border-background h-9 w-full rounded-md border bg-transparent px-3 py-1 pr-16 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50`}
      />
      {icon && (
        <Button variant="ghost" className="absolute right-0.5">
          Apply
        </Button>
      )}
    </div>
  )
}

export default Input
