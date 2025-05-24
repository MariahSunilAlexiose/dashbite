import React, { useEffect, useState } from "react"

import { dark, light, ThemeContext } from "@context"
import PropTypes from "prop-types"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || light
    }
    return light
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === dark)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const setSystemTheme = () => {
      const systemTheme = mediaQuery.matches ? dark : light
      setTheme(systemTheme)
      localStorage.setItem("theme", systemTheme)
    }

    setSystemTheme()
    mediaQuery.addEventListener("change", setSystemTheme)

    return () => mediaQuery.removeEventListener("change", setSystemTheme)
  }, [])

  return { theme, setTheme }
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function ThemeProvider({ children }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === dark ? light : dark
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
