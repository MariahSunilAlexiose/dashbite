import React from "react"

import { createRoot } from "react-dom/client"

import App from "./App.jsx"

import "@styles/globals.css"

import { BrowserRouter } from "react-router-dom"

import { StoreProvider, ThemeProvider, ToastProvider } from "@providers"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
)
