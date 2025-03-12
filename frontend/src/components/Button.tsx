import React from "react"

import { ButtonVariants } from "../constants.js"

interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "accent"
    | "ghost"
    | "link"
    | "success"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
  type?: "submit" | "reset" | "button"
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button: React.FC<ButtonProps> = ({
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

export default Button
