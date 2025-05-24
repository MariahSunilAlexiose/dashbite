import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Checkbox, Input, Label } from "@cmp"
import { StoreContext } from "@context"
import { LoginSignup } from "@img"
import { useToast } from "@providers"
import axios from "axios"

const Signup = () => {
  const { url, setToken } = useContext(StoreContext)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [checked, setChecked] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData((data) => ({ ...data, [name]: value }))
  }

  const onSignup = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${url}/api/user/register`, data)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      setToken(res.data.token)
      localStorage.setItem("token", res.data.token)
      navigate("/profile")
    } catch (err) {
      console.error("Error registering:", err)
      addToast("error", "Error", "Failed to register user!")
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative m-6 flex flex-col space-y-8 rounded-2xl shadow-2xl md:flex-row md:space-y-0">
        <div className="bg-accent flex flex-col justify-center rounded-l-2xl p-8 md:p-14">
          <h2 className="text-5xl font-bold">Getting Started</h2>
          <p className="text-muted mb-2 mt-0 font-light">
            Please enter your details
          </p>
          <div className="py-4">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              onChange={onChangeHandler}
              value={data.name}
              name="name"
            />
          </div>
          <div className="py-4">
            <Label htmlFor="password">Email</Label>
            <Input
              type="email"
              onChange={onChangeHandler}
              value={data.email}
              name="email"
            />
          </div>
          <div className="py-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              onChange={onChangeHandler}
              value={data.password}
              name="password"
            />
          </div>
          <div className="flex w-full justify-between py-4">
            <Checkbox
              label="I agree to the Terms & Conditions"
              checked={checked}
              setChecked={setChecked}
            />
          </div>
          <Button
            variant="ghost"
            className="bg-foreground hover:bg-blue-80 text-background hover:text-background! dark:hover:bg-blue-30"
            onClick={(e) => {
              if (!checked)
                return addToast(
                  "error",
                  "Error",
                  "Please agree to the Terms & Conditions!"
                )
              onSignup(e)
            }}
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
