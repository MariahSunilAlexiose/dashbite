import React, { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"

import { Navbar, Toasts } from "@cmp"
import {
  Address,
  Cart,
  Cuisine,
  Dish,
  Home,
  Login,
  MyOrders,
  MyReviews,
  PlaceOrder,
  Profile,
  Restaurant,
  Signup,
  Verify,
} from "@pages"
import { Footer } from "@sections"

import ProtectedRoute from "./ProtectedRoute"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return null
}

function App() {
  return (
    <div>
      <ScrollToTop />
      <div className="flex flex-col px-6 pb-6 lg:px-20">
        <Navbar />
        <Toasts />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <Verify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myreviews"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />
          <Route path="/cuisine/:cuisineID" element={<Cuisine />} />
          <Route path="/dish/:dishID" element={<Dish />} />
          <Route path="/restaurant/:restaurantID" element={<Restaurant />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
