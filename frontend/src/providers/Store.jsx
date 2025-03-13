import React, { useState } from "react"

import { store, StoreContext } from "@context"
import PropTypes from "prop-types"

export const StoreProvider = (props) => {
  const [cartItems, setCartItems] = useState({})
  const addToCart = (itemID) => {
    setCartItems((prev) => {
      const currentCount = prev[itemID] || 0
      return { ...prev, [itemID]: currentCount + 1 }
    })
  }
  const removeFromCart = (itemID) => {
    setCartItems((prev) => ({ ...prev, [itemID]: prev[itemID] - 1 }))
  }
  const context = {
    store,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
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
