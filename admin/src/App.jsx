import React from "react"
import { Route, Routes } from "react-router-dom"

import { Sidebar, Toasts } from "@cmp"
import { AddDish, Dishes, Order, Orders, UpdateDish } from "@pages"

import { sidebarItems } from "@/constants"

function App() {
  return (
    <div className="flex h-full">
      <Toasts />
      <Sidebar items={sidebarItems} />
      <div className="flex-1 px-5 pt-6 lg:px-20">
        <Routes>
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/dishes/add_form" element={<AddDish />} />
          <Route path="/dishes/update_form" element={<UpdateDish />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderID" element={<Order />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
