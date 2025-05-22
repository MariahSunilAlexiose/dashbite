import React from "react"

import PropTypes from "prop-types"

const ProgressBar = ({ value, className }) => {
  return (
    <div
      className={`${className} bg-blue-30 relative h-2 w-full overflow-hidden rounded-full`}
    >
      <div
        className="bg-primary h-full transition-all"
        style={{ width: `${value || 0}%` }} // Adjusting width instead of using transform
      />
    </div>
  )
}

ProgressBar.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
}

export default ProgressBar
