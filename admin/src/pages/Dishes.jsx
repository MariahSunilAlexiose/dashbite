import React from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@cmp"
import { PlusIcon } from "@icons"

const Dishes = () => {
  const navigate = useNavigate()
  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <h2>Dishes</h2>
        <Button
          size="icon"
          variant="success"
          onClick={() => navigate("/dishes/add_form")}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
    </div>
  )
}

export default Dishes
