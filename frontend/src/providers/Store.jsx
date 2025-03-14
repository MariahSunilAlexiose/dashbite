import React, { useEffect, useState } from "react"

import { store, StoreContext } from "@context"
import PropTypes from "prop-types"

export const StoreProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load initial cartItems from localStorage if available
    const storedCartItems = localStorage.getItem("cartItems")
    return storedCartItems ? JSON.parse(storedCartItems) : {}
  })

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
        let itemInfo = store.dishes.find((dish) => dish._id === Number(item))
        if (itemInfo) {
          totalAmt += itemInfo.price * cartItems[item]
        }
      }
    }
    return totalAmt
  }

  const context = {
    store,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmt,
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
