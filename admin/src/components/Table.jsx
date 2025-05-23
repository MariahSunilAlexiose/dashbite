import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@cmp"
import { PencilIcon, TrashIcon, UserIcon, UserWhiteIcon } from "@icons"
import { useTheme, useToast } from "@providers"
import axios from "axios"
import PropTypes from "prop-types"

import { backendImgURL, backendURL, formatDate, keyMapping } from "@/constants"

import { Pagination } from "."

const handleDelete = async ({ addToast, ID, ID2, tableName }) => {
  try {
    let res
    if (tableName === "restaurantDish")
      res = await axios.delete(`${backendURL}/restaurant/${ID}/dish/${ID2}`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
    else
      res = await axios.delete(`${backendURL}/${tableName}/${ID}`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
    if (!res.data.success) {
      console.error(res.data.message)
      return addToast("error", "Error", res.data.message)
    }
    addToast("success", "Success", "Removed Item!")
    window.location.reload()
  } catch (err) {
    console.error("Error deleting:", err)
    addToast("error", "Error", "Error in deleting!")
  }
}

const Table = ({ tableName, data, pageID, extraData }) => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setTotal(data.reduce((acc, item) => acc + item.subtotal, 0))
  }, [data])

  const currentItems = data.slice(firstItemIndex, lastItemIndex)
  const dataMap = new Map()

  data.forEach((item, index) => {
    dataMap.set(index, item)
  })

  const filteredKeys =
    data?.[0] && typeof data[0] === "object"
      ? Object.keys(data[0]).filter(
          (key) =>
            key !== "_id" &&
            key !== "__v" &&
            key !== "updatedAt" &&
            key !== "createdAt" &&
            key !== "servingSize" &&
            key !== "ingredients" &&
            key !== "calories" &&
            key !== "fat" &&
            key !== "protein" &&
            key !== "carbs" &&
            key !== "allergens" &&
            key !== "userID"
        )
      : []

  if (!data || data.length === 0) return <div>No data available</div>

  return (
    <div className="relative w-full overflow-auto text-center">
      <table className="w-full items-center justify-center text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {filteredKeys.map((key, index) => {
              const header =
                keyMapping[key] || key.replace(/\b\w/g, (c) => c.toUpperCase())
              return (
                <th
                  key={header}
                  className="h-10 w-[100px] px-4 text-center align-middle font-bold"
                >
                  {["image", "images", "profilePic"].includes(
                    filteredKeys[index]
                  )
                    ? ""
                    : header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {currentItems.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-accent cursor-pointer border-b transition-colors"
            >
              {filteredKeys.map((header) => (
                <td
                  key={header}
                  className="w-1/6 p-2 align-middle"
                  onClick={() => {
                    if (tableName === "category")
                      navigate(`/categories/${row["_id"]}`)
                    else if (
                      tableName === "dish" ||
                      tableName === "restaurantDish"
                    )
                      navigate(`/dishes/${row["_id"]}`)
                    else if (
                      tableName !== "orderitem" &&
                      tableName !== "review"
                    )
                      navigate(`/${tableName}s/${row["_id"]}`)
                  }}
                >
                  {header === "unitPrice" ||
                  header === "price" ||
                  header === "amount" ||
                  header === "salary" ||
                  header === "subtotal" ? (
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
                  ) : header === "profilePic" ? (
                    <div className="flex items-center justify-center">
                      <img
                        src={
                          row[header]
                            ? row[header].startsWith(
                                "https://ui-avatars.com/api/?name="
                              )
                              ? row[header]
                              : `${backendImgURL}/${row[header]}`
                            : theme === "dark"
                              ? UserWhiteIcon
                              : UserIcon
                        }
                        alt="User Profile"
                        className="h-15 w-15 aspect-square rounded-full object-cover"
                      />
                    </div>
                  ) : header === "payment" ? (
                    row[header] ? (
                      "Paid"
                    ) : (
                      "Not Paid"
                    )
                  ) : header === "deliveryType" ? (
                    row[header] === "Free Shipping" ? (
                      "Free Shipping"
                    ) : row[header] === "Express Shipping" ? (
                      "Express Shipping"
                    ) : (
                      "Pick Up"
                    )
                  ) : header === "items" ? (
                    <div className="flex items-center justify-center gap-2">
                      {row.items.map((item, key) => (
                        <div key={key} className="relative h-12 w-12">
                          <img
                            src={`${backendImgURL}/${item.image}`}
                            alt={item.name}
                            className="h-full w-full rounded"
                          />
                          <div className="bg-foreground text-background absolute -right-2 -top-2 rounded-full px-2.5 py-1 text-xs font-bold shadow-md">
                            {item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : header === "images" ? (
                    <div className="flex items-center justify-center gap-2">
                      {row.images.map((image, key) => (
                        <div key={key} className="relative h-12 w-12">
                          <img
                            src={`${backendImgURL}/${image}`}
                            alt={image}
                            className="h-full w-full rounded"
                          />
                        </div>
                      ))}
                    </div>
                  ) : row[header] ? (
                    row[header]
                  ) : (
                    "-"
                  )}
                </td>
              ))}
              {tableName !== "orderitem" && tableName !== "review" && (
                <td className="flex items-center justify-center gap-3 py-8 align-middle">
                  {tableName !== "order" &&
                    tableName !== "user" &&
                    tableName !== "restaurant" &&
                    tableName !== "dish" && (
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/update_form`, {
                            state: {
                              tableName,
                              pageID: pageID || row._id,
                              dataToBeUpdated: data.find(
                                (d) => d._id === row._id
                              ),
                            },
                          })
                        }}
                      >
                        <img
                          src={PencilIcon}
                          alt="Pencil Icon"
                          className="h-4 w-4"
                        />
                      </Button>
                    )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (tableName === "restaurantDish")
                        handleDelete({
                          addToast,
                          ID: pageID,
                          tableName,
                          ID2: row._id,
                        })
                      else handleDelete({ addToast, ID: row._id, tableName })
                    }}
                  >
                    <img src={TrashIcon} alt="Trash Icon" className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
          {tableName === "orderitem" && (
            <>
              <tr className="p-5">
                <td className="py-5 font-bold">Sub Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td>${total}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="py-2 font-bold">{extraData.deliveryType}</td>
                <td>
                  {extraData.deliveryType === "Pick Up"
                    ? `-${Math.abs((total * 0.05).toFixed(2))}`
                    : extraData.deliveryType === "Express Shipping"
                      ? `$15`
                      : `$0`}
                </td>
              </tr>
              <tr>
                <td className="py-5 font-bold">Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="font-bold">${extraData.amount}</td>
              </tr>
            </>
          )}
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
  pageID: PropTypes.string,
  extraData: PropTypes.shape({
    deliveryType: PropTypes.string,
    amount: PropTypes.number,
  }),
}

export default Table
