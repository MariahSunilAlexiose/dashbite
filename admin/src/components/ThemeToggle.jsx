import React from "react"

import { dark } from "@context"
import { MoonIcon, SunIcon } from "@icons"
import PropTypes from "prop-types"

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <div
      onClick={toggleTheme}
      className="cursor-pointer content-center"
      style={{ transition: "background 0.3s ease-in-out" }}
    >
      <img
        src={theme === dark ? SunIcon : MoonIcon}
        alt={theme === dark ? "Sun Icon" : "Moon Icon"}
        width={24}
        height={24}
      />
    </div>
  )
}

ThemeToggle.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
}

export default ThemeToggle
