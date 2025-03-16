import { createContext } from "react"

export const Theme = {
  light: "light",
  dark: "dark",
}

export const { light, dark } = Theme

export const ThemeContext = createContext({
  theme: dark,
  setTheme: () => {},
  toggleTheme: () => {},
})
