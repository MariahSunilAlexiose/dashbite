import React from "react"
import { Route, Routes } from "react-router-dom"

import { Sidebar, Toasts } from "@cmp"
import {
  AddForm,
  Categories,
  Category,
  Cuisine,
  Cuisines,
  Dish,
  Dishes,
  Order,
  Orders,
  Restaurant,
  Restaurants,
  UpdateForm,
  User,
  Users,
} from "@pages"

function App() {
  return (
    <div className="flex h-full">
      <Toasts />
      <Sidebar />
      <div className="flex-1 px-5 pt-6 lg:px-20">
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/dishes/:dishID" element={<Dish />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderID" element={<Order />} />
          <Route path="/add_form" element={<AddForm />} />
          <Route path="/update_form" element={<UpdateForm />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userID" element={<User />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryID" element={<Category />} />
          <Route path="/cuisines" element={<Cuisines />} />
          <Route path="/cuisines/:cuisineID" element={<Cuisine />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:restaurantID" element={<Restaurant />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
