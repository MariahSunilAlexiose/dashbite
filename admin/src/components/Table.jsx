import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useToast } from "@providers"
import axios from "axios"
import PropTypes from "prop-types"

import { backendImgURL, backendURL, formatDate, keyMapping } from "@/constants"

import { Pagination } from "."

const handleDelete = async ({ addToast, foodID }) => {
  try {
    await axios.delete(`${backendURL}/dish/remove`, { data: { id: foodID } })
    addToast("success", "Success", "Removed dish")
    window.location.reload()
  } catch (err) {
    console.log("Error deleting data:", err)
    addToast("error", "Error", "Error in listing dish")
  }
}

const Table = ({ tableName, data }) => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage

  // eslint-disable-next-line no-unused-vars
  const filteredData = data.map(({ _id, ...rest }) => rest)

  const currentItems = data.slice(firstItemIndex, lastItemIndex)

  const dataMap = new Map()
  data.forEach((item, index) => {
    dataMap.set(index, item)
  })

  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div className="relative w-full overflow-auto text-center">
      <table className="w-full items-center justify-center text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {Object.keys(filteredData[0])
              .map((key) => keyMapping[key] || key)
              .map((header) => (
                <th
                  key={header}
                  className="h-10 w-[100px] px-4 text-center align-middle font-bold"
                >
                  {header === "image" ? "" : header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {currentItems.map((row, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b transition-colors hover:bg-[#f1f5f9]"
            >
              {Object.keys(filteredData[0]).map((header) => (
                <td key={header} className="w-1/6 p-2 align-middle">
                  {header === "unitPrice" ||
                  header === "price" ||
                  header === "salary" ? (
                    `$${row[header]}`
                  ) : header === "date" ? (
                    formatDate(row[header])
                  ) : header === "image" ? (
                    <div className="flex items-center justify-center">
                      <img
                        src={`${backendImgURL}/${row[header]}`}
                        alt={row.name || "Image"}
                        className="h-16 w-16 object-cover"
                      />
                    </div>
                  ) : (
                    row[header]
                  )}
                </td>
              ))}
              <td className="w-1/6 p-2 align-middle">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate("/edit_form", {
                      state: {
                        tableName,
                        dataToBeUpdated: data.find((d) => d._id === row._id),
                      },
                    })
                  }}
                  className="mr-1 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete({ addToast, foodID: row._id })
                  }}
                  className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-5">
        <Pagination
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  )
}

Table.propTypes = {
  tableName: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Table
