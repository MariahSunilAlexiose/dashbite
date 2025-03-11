import React from "react"

import { ThemeToggle } from "@/components"
import { ThemeProvider } from "@/providers"

function App() {
  return (
    <ThemeProvider>
      <div>
        <h1 className="text-primary">DashBite</h1>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App
