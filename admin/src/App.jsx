import React from "react"
import { Route, Routes } from "react-router-dom"

import { Sidebar } from "@cmp"
import { AddDish, Dishes } from "@pages"

import { sidebarItems } from "@/constants"

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 px-5 pt-6 lg:px-20">
        <Routes>
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/dishes/add_form" element={<AddDish />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
