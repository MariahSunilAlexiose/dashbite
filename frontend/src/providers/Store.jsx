import React, { useEffect, useState } from "react"

import { StoreContext } from "@context"
import axios from "axios"
import PropTypes from "prop-types"

export const StoreProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems")
    return storedCartItems ? JSON.parse(storedCartItems) : {}
  })

  const [token, setToken] = useState("")

  const url = "http://localhost:4000"

  const [dishes, setDishes] = useState([])

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: (prev[itemID] || 0) + 1,
    }))
  }

  const removeFromCart = (itemID) => {
    setCartItems((prev) => {
      const currentCount = prev[itemID] || 0
      if (currentCount > 1) {
        return { ...prev, [itemID]: currentCount - 1 }
      } else {
        const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
        return rest
      }
    })
  }

  const deleteFromCart = (itemID) => {
    setCartItems((prev) => {
      const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
      return rest
    })
  }

  const getTotalCartAmt = () => {
    let totalAmt = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // Convert item (string) to a number for comparison
        let itemInfo = dishes.find((dish) => dish._id === item)
        if (itemInfo) {
          totalAmt += itemInfo.price * cartItems[item]
        }
      }
    }
    return totalAmt
  }

  const fetchDishes = async () => {
    const response = await axios.get(`${url}/api/dish/`)
    setDishes(response.data.data)
  }

  useEffect(() => {
    async function loadData() {
      await fetchDishes()
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"))
      }
    }
    loadData()
  }, [])

  const context = {
    dishes,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmt,
    token,
    setToken,
    url,
  }

  return (
    <StoreContext.Provider value={context}>
      {props.children}
    </StoreContext.Provider>
  )
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
