import React from "react"

import PropTypes from "prop-types"

const ButtonVariants = {
  variant: {
    default: "bg-muted text-foreground shadow-sm hover:bg-muted/80",
    primary: "bg-primary text-white shadow hover:bg-primary/85",
    destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/85",
    outline:
      "border rounded border-muted bg-background shadow-sm hover:bg-accent hover:text-foreground",
    accent: "bg-accent text-foreground shadow-sm hover:bg-accent/85",
    ghost: "rounded hover:bg-accent/80 hover:text-foreground",
    link: "text-primary hover:text-primary/85 underline-offset-4 hover:underline",
    success:
      "bg-green-600 text-background shadow-sm hover:bg-green/85 shadow-green-400/40",
    badge: "bg-accent text-badge w-fit",
  },
  size: {
    default: "h-9 px-4 py-2",
    badge: "rounded-full px-2 text-xs",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-5 w-9",
  },
}

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
