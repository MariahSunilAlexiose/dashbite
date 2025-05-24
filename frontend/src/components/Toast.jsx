import React from "react"

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@icons"
import PropTypes from "prop-types"

import { Button } from "."

const ToastVariants = {
  success: {
    styles: "bg-green-300 text-green-800",
    title: "Success",
    description: "This action has been successfully implemented!",
    icon: { img: CheckCircleIcon, name: "Check Circle Icon" },
  },
  error: {
    styles: "bg-red-300 text-red-800",
    title: "Action Failed",
    description: "This action has failed!",
    icon: { img: ExclamationTriangleIcon, name: "Exclamation Circle Icon" },
  },
  info: {
    styles: "bg-blue-300 text-blue-800",
    icon: { img: InformationCircleIcon, name: "Information Circle Icon" },
  },
}

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
