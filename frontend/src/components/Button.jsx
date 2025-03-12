import React from "react"

import PropTypes from "prop-types"

import { ButtonVariants } from "@/constants"

const Button = ({
  variant = "default",
  size = "default",
  children,
  type = "button",
  className = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`${className} ${ButtonVariants.variant[variant]} ${ButtonVariants.size[size]} focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf([
    "default",
    "destructive",
    "outline",
    "accent",
    "ghost",
    "link",
    "success",
  ]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["submit", "reset", "button"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  setMobileMenu: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
}

export default Button
