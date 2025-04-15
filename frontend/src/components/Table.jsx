import React from "react"

import PropTypes from "prop-types"

const TableRow = ({ children, className }) => {
  return (
    <tr className={`${className} border-b transition-colors`}>{children}</tr>
  )
}

const TableHead = ({ children, className }) => {
  return (
    <th className={`${className} text-muted h-10 p-2 text-center`}>
      {children}
    </th>
  )
}

const TableCell = ({ children, className }) => {
  return <td className={`${className} p-2 text-center`}>{children}</td>
}

TableRow.propTypes =
  TableHead.propTypes =
  TableCell.propTypes =
    {
      children: PropTypes.node.isRequired,
      className: PropTypes.string,
    }

export { TableCell, TableHead, TableRow }
