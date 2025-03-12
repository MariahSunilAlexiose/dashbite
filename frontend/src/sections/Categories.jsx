import React from "react"

import { Avatar } from "@cmp"

import { categoryLinks } from "@/constants"

const Categories = () => {
  return (
    <div>
      <h2>Explore our menu</h2>
      <p className="max-w-[55vw] leading-5">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-8">
        {categoryLinks.map((link, index) => (
          <Avatar key={index} image={link.image} title={link.label} />
        ))}
      </div>
    </div>
  )
}

export default Categories
