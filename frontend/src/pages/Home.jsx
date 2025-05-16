import React from "react"

import { Cuisines, Download, Header, Menu, Restaurants } from "@sections"

const Home = () => {
  return (
    <div className="flex flex-col gap-6 pt-6">
      <Header />
      <Cuisines />
      <Restaurants />
      <Menu />
      <div className="py-15">
        <Download />
      </div>
    </div>
  )
}

export default Home
