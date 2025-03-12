import React from "react"

import { Navbar } from "@cmp"
import { ThemeProvider } from "@providers"

function App() {
  return (
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  )
}

export default App
