import React from "react"
import { Route, Routes } from "react-router-dom"

import { Sidebar, Toasts } from "@cmp"
import {
  AddForm,
  Categories,
  Category,
  Dishes,
  Order,
  Orders,
  UpdateForm,
  User,
  Users,
} from "@pages"

import { sidebarItems } from "@/constants"

function App() {
  return (
    <div className="flex h-full">
      <Toasts />
      <Sidebar items={sidebarItems} />
      <div className="flex-1 px-5 pt-6 lg:px-20">
        <Routes>
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderID" element={<Order />} />
          <Route path="/add_form" element={<AddForm />} />
          <Route path="/update_form" element={<UpdateForm />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userID" element={<User />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryID" element={<Category />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
