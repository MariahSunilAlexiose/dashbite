import React from "react"

import { moon, sun } from "@/assets/icons"
import { dark, light } from "@/context"
import { useTheme } from "@/providers"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(theme === dark ? light : dark)
  }
  return (
    <div
      onClick={toggleTheme}
      style={{ transition: "background 0.3s ease-in-out" }}
    >
      {theme === dark ? (
        <img src={sun} alt="Sun Icon" width={24} height={24} />
      ) : (
        <img src={moon} alt="Moon Icon" width={24} height={24} />
      )}
    </div>
  )
}

export default ThemeToggle
