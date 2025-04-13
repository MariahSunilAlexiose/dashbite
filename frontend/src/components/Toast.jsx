import React from "react"

import { XMarkIcon } from "@icons"
import PropTypes from "prop-types"

import { ToastVariants } from "@/constants"

import { Button } from "."

const Toast = ({ id, type, title, description, removeToast }) => {
  return (
    <div
      className={`${ToastVariants[type].styles} mb-2.5 flex justify-between rounded-md p-2.5`}
    >
      <div className="flex items-center gap-2">
        <img
          src={ToastVariants[type].icon.img}
          alt={ToastVariants[type].icon.name}
          className="h-8 w-8"
        />
        <div>
          <h4>{title}</h4>
          <p className="m-0">{description}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="w-3 pl-20 pr-3 hover:bg-transparent focus-visible:outline-offset-[-4px]"
        onClick={() => removeToast(id)}
        size="icon"
      >
        <span className="sr-only">Dismiss</span>
        <img
          src={XMarkIcon}
          alt="Close Icon"
          className="h-5 min-h-5 w-5 min-w-5 text-white"
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}

Toast.propTypes = {
  id: PropTypes.string,
  type: "success" | "error" | "info",
  title: PropTypes.string,
  description: PropTypes.string,
  removeToast: PropTypes.func.isRequired,
}

export default Toast
