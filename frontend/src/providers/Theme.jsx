import React, { useEffect, useState } from "react"

import { dark, light, ThemeContext } from "@context"
import PropTypes from "prop-types"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ? dark : light
    }
    return light
  })

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === dark ? light : dark))
  }

  useEffect(() => {
    const setSystemTheme = () => {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? dark
        : light
      setTheme(systemTheme)
    }

    setSystemTheme() // Set theme based on system preference on initial load
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", setSystemTheme)

    // Cleanup event listener on component unmount
    return () => mediaQuery.removeEventListener("change", setSystemTheme)
  }, [])

  useEffect(() => {
    if (theme === dark) {
      document.documentElement.classList.add("dark")
      document.documentElement.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", dark)
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.setAttribute("data-theme", "light")
      localStorage.setItem("theme", light)
    }
  }, [theme])

  return { theme, setTheme, toggleTheme }
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function ThemeProvider({ children }) {
  const { theme, setTheme, toggleTheme } = useTheme()

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
