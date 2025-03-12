import React from "react"

import { Button } from "@cmp"

const Header = () => {
  return (
    <div className="mx-0 content-center rounded-3xl bg-[url(/src/assets/images/header.jpg)] bg-cover bg-no-repeat xl:h-[45vw] dark:bg-[url(/src/assets/images/dark_mode/header.jpg)]">
      <div className="flex max-w-[55%] flex-col gap-3 p-6 lg:gap-6 lg:pl-20 xl:gap-9">
        <h1 className="lg:leading-18 xl:leading-20">
          Order your <br /> favorite food here
        </h1>
        <p className="mt-0">
          Choose from a diverse menu featuring a delectable array of dishes
          created with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <div>
          <Button>View Menu</Button>
        </div>
      </div>
    </div>
  )
}

export default Header
