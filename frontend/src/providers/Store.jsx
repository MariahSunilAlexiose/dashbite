import React from "react"

import { store, StoreContext } from "@context"
import PropTypes from "prop-types"

export const StoreProvider = (props) => {
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
