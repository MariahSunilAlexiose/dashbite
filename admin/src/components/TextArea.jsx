import React from "react"

import PropTypes from "prop-types"

const TextArea = ({ placeholder, value, className, onChange }) => {
  return (
    <textarea
      className={`${className} border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}

TextArea.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
}

export default TextArea
