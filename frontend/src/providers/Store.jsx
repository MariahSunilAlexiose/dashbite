import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import PropTypes from "prop-types"

export const StoreProvider = (props) => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems")
    return storedCartItems ? JSON.parse(storedCartItems) : {}
  })

  const [token, setToken] = useState("")
  const [userID, setUserID] = useState(null)

  const url = "http://localhost:4000"

  const [dishes, setDishes] = useState([])

  // Fetch cart items from the server
  const loadCartData = async (userToken) => {
    try {
      const response = await axios.get(url + "/api/cart/", {
        headers: { token: userToken },
      })
      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }
      setCartItems(response.data.cartData)
    } catch (error) {
      console.error("Error fetching cart data:", error)
    }
  }

  // Fetch dishes
  const fetchDishes = async () => {
    try {
      const response = await axios.get(`${url}/api/dish/`)
      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }
      setDishes(response.data.data)
    } catch (error) {
      console.error("Error fetching dishes:", error)
    }
  }

  const getUserID = async () => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken)
        if (decodedToken?.id) {
          setToken(storedToken)
          setUserID(decodedToken.id)
          loadCartData(storedToken)
        } else {
          console.error("Decoded token missing ID.")
          navigate("/login")
        }
      } catch (error) {
        console.error("Invalid token:", error)
        navigate("/login")
      }
    }
  }

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    getUserID()
    fetchDishes()
  }, [])

  const addToCart = async (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: (prev[itemID] || 0) + 1,
    }))
    if (token) {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemID },
        { headers: { token } }
      )
      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }
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
      const response = await axios.post(
        url + "/api/cart/remove",
        { itemID },
        { headers: { token } }
      )
      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }
    }
  }

  const deleteFromCart = async (itemID) => {
    setCartItems((prev) => {
      const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
      return rest
    })
    if (token) {
      const response = await axios.delete(url + "/api/cart/delete", {
        headers: { token },
        data: { itemID },
      })
      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }
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
    userID,
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
