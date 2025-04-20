import React from "react"
import { Route, Routes } from "react-router-dom"

import { Navbar, Toasts } from "@cmp"
import {
  Address,
  Cart,
  Home,
  Login,
  MyOrders,
  PlaceOrder,
  Profile,
  Signup,
  Verify,
} from "@pages"
import { Footer } from "@sections"

function App() {
  return (
    <div>
      <div className="flex flex-col px-6 pb-6 lg:px-20">
        <Navbar />
        <Toasts />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/address" element={<Address />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
