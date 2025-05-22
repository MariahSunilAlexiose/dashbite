import React from "react"

import { XMarkIcon } from "@icons"
import PropTypes from "prop-types"

import { Button } from "."

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="z-1 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-96 rounded-lg bg-white p-6">
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
              src={XMarkIcon}
              alt="Close Icon"
              className="h-5 min-h-5 w-5 min-w-5 text-white"
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
