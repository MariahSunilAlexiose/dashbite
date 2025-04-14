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

  // Fetch cart items from the server
  const loadCartData = async (userToken) => {
    try {
      const response = await axios.get(url + "/api/cart/", {
        headers: { token: userToken },
      })
      console.log("Fetched Cart Data:", response.data.cartData)
      setCartItems(response.data.cartData) // Update state with API data
    } catch (error) {
      console.error("Error fetching cart data:", error)
    }
  }

  // Fetch dishes
  const fetchDishes = async () => {
    try {
      const response = await axios.get(`${url}/api/dish/`)
      setDishes(response.data.data)
    } catch (error) {
      console.error("Error fetching dishes:", error)
    }
  }

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  // Fetch data on mount (cart and dishes)
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      loadCartData(storedToken)
    }
    fetchDishes()
  }, [])

  const addToCart = async (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: (prev[itemID] || 0) + 1,
    }))
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemID },
        { headers: { token } }
      )
    }
  }

  const removeFromCart = async (itemID) => {
    setCartItems((prev) => {
      const currentCount = prev[itemID] || 0
      if (currentCount > 1) {
        return { ...prev, [itemID]: currentCount - 1 }
      } else {
        const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
        return rest
      }
    })
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemID },
        { headers: { token } }
      )
    }
  }

  const deleteFromCart = async (itemID) => {
    setCartItems((prev) => {
      const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
      return rest
    })
    if (token) {
      await axios.delete(url + "/api/cart/delete", {
        headers: { token },
        data: { itemID },
      })
    }
  }

  const getTotalCartAmt = () => {
    let totalAmt = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = dishes.find((dish) => dish._id === item)
        if (itemInfo) {
          totalAmt += itemInfo.price * cartItems[item]
        }
      }
    }
    return totalAmt
  }

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
