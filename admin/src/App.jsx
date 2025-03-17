import React from "react"
import { Routes } from "react-router-dom"

import { Sidebar } from "@cmp"

import { sidebarItems } from "@/constants"

function App() {
  return (
    <div>
      <Sidebar items={sidebarItems} />
      <div className="flex flex-col px-6 pb-6 lg:px-20">
        <Routes></Routes>
      </div>
    </div>
  )
}

export default App
