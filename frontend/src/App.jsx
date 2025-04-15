import React from "react"
import { Route, Routes } from "react-router-dom"

import { Navbar } from "@cmp"
import { Cart, Home, Login, PlaceOrder, Signup, Verify } from "@pages"
import { Footer } from "@sections"

function App() {
  return (
    <div>
      <div className="flex flex-col px-6 pb-6 lg:px-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
