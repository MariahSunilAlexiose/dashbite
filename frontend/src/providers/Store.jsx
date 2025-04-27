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
      const res = await axios.get(url + "/api/cart/", {
        headers: { token: userToken },
      })
      if (!res.data.success) {
        addToast("error", "Error", `Error: ${res.data.message}`)
        return
      }
      setCartItems(res.data.cartData)
    } catch (err) {
      addToast("error", "Error", `Error in retrieving cart items: ${err}`)
    }
  }

  // Fetch dishes
  const fetchDishes = async () => {
    try {
      const res = await axios.get(`${url}/api/dish/`)
      if (!res.data.success) {
        addToast("error", "Error", `Error: ${res.data.message}`)
        return
      }
      setDishes(res.data.data)
    } catch (err) {
      addToast("error", "Error", `Error in retrieving cart items: ${err}`)
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
          addToast("error", "Error", "Decoded token missing ID.")
          navigate("/login")
        }
      } catch (err) {
        addToast("error", "Error", `Invalid token: ${err}`)
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
      const res = await axios.post(
        url + "/api/cart/add",
        { itemID },
        { headers: { token } }
      )
      if (!res.data.success) {
        addToast("error", "Error", `Error: ${res.data.message}`)
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
      const res = await axios.post(
        url + "/api/cart/remove",
        { itemID },
        { headers: { token } }
      )
      if (!res.data.success) {
        addToast("error", "Error", `Error: ${res.data.message}`)
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
      const res = await axios.delete(url + "/api/cart/delete", {
        headers: { token },
        data: { itemID },
      })
      if (!res.data.success) {
        addToast("error", "Error", `Error: ${res.data.message}`)
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
