import React from "react"

import { Download, Header, Menu } from "@sections"

const Home = () => {
  return (
    <div className="flex flex-col gap-6 pt-6">
      <Header />
      <Menu />
      <Download />
    </div>
  )
}

export default Home
