import React, { useContext } from "react"

import { dark, ThemeContext } from "@context"
import { MoonIcon, SunIcon } from "@icons"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
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

export default ThemeToggle
