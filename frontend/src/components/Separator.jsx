import React from "react"

import PropTypes from "prop-types"

const Separator = ({ orientation = "horizontal", className }) => {
  return (
    <div
      className={`${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"} ${className} bg-border shrink-0`}
    ></div>
  )
}

Separator.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  className: PropTypes.string,
}

export default Separator
