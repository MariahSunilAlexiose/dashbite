import React, { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import { StoreContext } from "@context"
import PropTypes from "prop-types"

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext)
  const [isWaiting, setIsWaiting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (isWaiting) return null

  if (!token) return <Navigate to="/login" />

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
