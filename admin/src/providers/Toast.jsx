import React, { useContext, useState } from "react"

import { ToastContext } from "@context"
import PropTypes from "prop-types"

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  console.log(toasts)

  const addToast = (type, title, description) => {
    const id = Math.random().toString(36).substring(7)
    setToasts([...toasts, { id, type, title, description }])

    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
