import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@cmp"
import { PencilIcon, TrashIcon } from "@icons"
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
  } catch (error) {
    addToast("error", "Error", `Error in deleting dish: ${error}`)
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
              <td className="flex gap-3 py-8 align-middle">
                <Button
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate("/dishes/update_form", {
                      state: {
                        tableName,
                        dataToBeUpdated: data.find((d) => d._id === row._id),
                      },
                    })
                  }}
                >
                  <img src={PencilIcon} alt="Pencil Icon" className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete({ addToast, foodID: row._id })
                  }}
                >
                  <img src={TrashIcon} alt="Trash Icon" className="h-4 w-4" />
                </Button>
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
