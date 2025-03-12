import React from "react"

import { Header, Navbar } from "@cmp"
import { ThemeProvider } from "@providers"

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col gap-6 px-6 lg:px-8">
        <Navbar />
        <Header />
      </div>
    </ThemeProvider>
  )
}

export default App
