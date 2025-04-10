import React from "react"

import { useToast } from "@providers"

import { Toast } from "."

const Toasts = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="z-1000 absolute right-0 m-4 p-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          removeToast={removeToast}
        />
      ))}
    </div>
  )
}

export default Toasts
