import React, { useContext } from "react"

import { dark, ThemeContext } from "@context"
import { XMarkIcon, XMarkWhiteIcon } from "@icons"
import PropTypes from "prop-types"

import { Button } from "."

const Modal = ({ title, children, onClose }) => {
  const { theme } = useContext(ThemeContext)
  return (
    <div className="z-2 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background relative w-96 rounded-lg p-6">
        <div className="flex justify-between">
          <h2 className="mb-4 text-lg font-bold">{title}</h2>
          <Button
            variant="ghost"
            className="w-3 pl-20 pr-3 hover:bg-transparent focus-visible:outline-offset-[-4px]"
            onClick={onClose}
            size="icon"
          >
            <span className="sr-only">Dismiss</span>
            <img
              src={theme === dark ? XMarkWhiteIcon : XMarkIcon}
              alt="Close Icon"
              className="h-5 min-h-5 w-5 min-w-5"
              aria-hidden="true"
            />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Modal
