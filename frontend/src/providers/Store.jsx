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
  const [categories, setCategories] = useState([])
  const [cuisines, setCuisines] = useState([])
  const [restaurants, setRestaurants] = useState([])

  // Fetch cart items from the server
  const loadCartData = async (userToken) => {
    try {
      const res = await axios.get(`${url}/api/cart/`, {
        headers: { token: userToken },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      setCartItems(res.data.cartData)
    } catch (err) {
      console.error("Error fetching cart items:", err)
      addToast("error", "Error", "Failed to fetch cart items!")
    }
  }

  const fetchDishes = async () => {
    try {
      const res = await axios.get(`${url}/api/dish/`)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      setDishes(res.data.data)
    } catch (err) {
      console.error("Error fetching dishes:", err)
      addToast("error", "Error", "Failed to fetch dishes!")
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/category/`)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      setCategories(res.data.data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      addToast("error", "Error", "Failed to fetch categories!")
    }
  }

  const fetchCuisines = async () => {
    try {
      const res = await axios.get(`${url}/api/cuisine/`)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      setCuisines(res.data.data)
    } catch (err) {
      console.error("Error fetching cuisines:", err)
      addToast("error", "Error", "Failed to fetch cuisines!")
    }
  }

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${url}/api/restaurant/`)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }

      const restaurants = res.data.data // Map of restaurants
      const enrichedRestaurants = await Promise.all(
        restaurants.map(async (restaurant) => {
          const { ...rest } = restaurant

          if (restaurant.cuisineIDs) {
            const cuisinePromises = restaurant.cuisineIDs.map(
              async (cuisineID) => {
                const cuisRes = await axios.get(
                  `${url}/api/cuisine/${cuisineID}`
                )
                if (!cuisRes.data.success) {
                  console.error(cuisRes.data.message)
                  return addToast("error", "Error", cuisRes.data.message)
                }
                return cuisRes.data.data
              }
            )

            rest.cuisines = (await Promise.all(cuisinePromises)).filter(Boolean)
          }

          if (restaurant.dishIDs) {
            const dishPromises = restaurant.dishIDs.map(async (dishID) => {
              const dishRes = await axios.get(`${url}/api/dish/${dishID}`)
              if (!dishRes.data.success) {
                addToast("error", "Error", dishRes.data.message)
                return null
              }
              return dishRes.data.data
            })

            rest.dishes = (await Promise.all(dishPromises)).filter(Boolean)
          }

          return rest
        })
      )
      setRestaurants(enrichedRestaurants)
    } catch (err) {
      console.error("Error fetching restaurants:", err)
      addToast("error", "Error", "Failed to fetch restaurants!")
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
          addToast("error", "Error", "Decoded token missing ID!")
          navigate("/login")
        }
      } catch (err) {
        console.error("Invalid token:", err)
        addToast("error", "Error", "Must login first!")
        navigate("/login")
      }
    }
  }

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems)) // Save cartItems to localStorage whenever it changes
  }, [cartItems])

  useEffect(() => {
    getUserID()
    fetchCategories()
    fetchDishes()
    fetchCuisines()
    fetchRestaurants()
  }, [])

  const addToCart = async (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: (prev[itemID] || 0) + 1,
    }))
    if (token) {
      const res = await axios.post(
        `${url}/api/cart`,
        { itemID },
        { headers: { token } }
      )
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
    }
  }

  const removeFromCart = async (itemID) => {
    setCartItems((prev) => {
      const currentCount = prev[itemID] || 0
      if (currentCount > 1) return { ...prev, [itemID]: currentCount - 1 }
      else {
        const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
        return rest
      }
    })
    if (token) {
      const res = await axios.put(
        `${url}/api/cart`,
        { itemID },
        { headers: { token } }
      )
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
    }
  }

  const deleteFromCart = async (itemID) => {
    setCartItems((prev) => {
      const { [itemID]: _, ...rest } = prev // eslint-disable-line no-unused-vars
      return rest
    })
    if (token) {
      const res = await axios.delete(`${url}/api/cart`, {
        headers: { token },
        data: { itemID },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
    }
  }

  const getTotalCartAmt = () => {
    let totalAmt = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = dishes.find((dish) => dish._id === item)
        if (itemInfo) totalAmt += itemInfo.price * cartItems[item]
      }
    }
    return totalAmt
  }

  const context = {
    restaurants,
    cuisines,
    categories,
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
