import React from "react"
import { Route, Routes } from "react-router-dom"

import { Navbar } from "@cmp"
import { Home } from "@pages"
import { Footer } from "@sections"

function App() {
  return (
    <div>
      <div className="flex flex-col px-6 pb-6 lg:px-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
