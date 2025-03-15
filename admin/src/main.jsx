import React from "react"

import { createRoot } from "react-dom/client"

import App from "./App.jsx"

import "./styles/globals.css"

import { ThemeProvider } from "@providers"

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
