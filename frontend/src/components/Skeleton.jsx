import React from "react"

import PropTypes from "prop-types"

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`${className} bg-primary/10 animate-pulse rounded-md`}
      {...props}
    />
  )
}

Skeleton.propTypes = {
  className: PropTypes.string,
}

export default Skeleton
