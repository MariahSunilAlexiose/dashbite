import React from "react"

import { Navbar } from "@cmp"
import { ThemeProvider } from "@providers"
import { Download, Header, Menu } from "@sections"

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col gap-6 px-6 lg:px-20">
        <Navbar />
        <Header />
        <Menu />
        <Download />
      </div>
    </ThemeProvider>
  )
}

export default App
