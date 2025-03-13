import React from "react"
import { useNavigate } from "react-router-dom"

import { Button, Checkbox, Input, Label } from "@cmp"
import { LoginSignup } from "@img"

const Signup = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center">
      <div className="relative m-6 flex flex-col space-y-8 rounded-2xl shadow-2xl md:flex-row md:space-y-0">
        <div className="bg-accent flex flex-col justify-center rounded-l-2xl p-8 md:p-14">
          <h2 className="text-5xl font-bold">Welcome</h2>
          <p className="text-muted mb-2 mt-0 font-light">
            Please enter your details
          </p>
          <div className="py-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" />
          </div>
          <div className="py-4">
            <Label htmlFor="password">Email</Label>
            <Input type="email" />
          </div>
          <div className="py-4">
            <Label htmlFor="password">Password</Label>
            <Input type="password" />
          </div>
          <div className="flex w-full justify-between py-4">
            <div className="mr-24">
              <Checkbox label="I agree to the Terms & Conditions" />
            </div>
          </div>
          <Button
            variant="ghost"
            className="bg-foreground hover:bg-blue-80 text-background hover:text-background! dark:hover:bg-blue-30"
          >
            Sign up
          </Button>
          {/* <button className="text-md mb-6 w-full rounded-lg border border-gray-300 p-2 hover:bg-black hover:text-white">
            <img src="google.svg" alt="img" className="mr-2 inline h-6 w-6" />
            Sign in with Google
          </button> */}
          <div className="text-muted pt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-foreground cursor-pointer font-bold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>
        <div className="relative">
          <img
            src={LoginSignup}
            alt="img"
            className="hidden h-full w-[400px] rounded-r-2xl object-cover md:block"
          />
        </div>
      </div>
    </div>
  )
}

export default Signup
