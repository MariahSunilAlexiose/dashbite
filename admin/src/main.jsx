import React from "react"
import { BrowserRouter } from "react-router-dom"

import { createRoot } from "react-dom/client"

import App from "./App.jsx"

import "@styles/globals.css"

import { ThemeProvider, ToastProvider } from "@providers"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
)
