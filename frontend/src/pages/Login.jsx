import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Checkbox, Input, Label } from "@cmp"
import { StoreContext } from "@context"
import { LoginSignup } from "@img"
import { useToast } from "@providers"
import axios from "axios"

const Login = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { url, setToken } = useContext(StoreContext)
  const [data, setData] = useState({
    email: "",
    password: "",
  })
  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData((data) => ({ ...data, [name]: value }))
  }
  const onLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${url}/api/user/login`, data)
      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      navigate("/")
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (err) {
      console.error(err)
      addToast(
        "error",
        "error",
        err.response?.data?.message || "An error occurred"
      )
    }
  }
  return (
    <div className="flex items-center justify-center">
      <div className="relative m-6 flex flex-col space-y-8 rounded-2xl shadow-2xl md:flex-row md:space-y-0">
        <div className="bg-accent flex flex-col justify-center rounded-l-2xl p-8 md:p-14">
          <h2 className="text-5xl font-bold">Welcome back</h2>
          <p className="text-muted mb-2 mt-0 font-light">
            Please enter your details
          </p>
          <div className="py-4">
            <Label htmlFor="password">Email</Label>
            <Input
              type="email"
              onChange={onChangeHandler}
              value={data.email}
              name="email"
              required
            />
          </div>
          <div className="py-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              onChange={onChangeHandler}
              value={data.password}
              name="password"
              required
            />
          </div>
          <div className="flex w-full justify-between py-4">
            <div className="mr-24">
              <Checkbox label="Remember me" />
            </div>
            <span className="cursor-pointer font-bold">Forgot password?</span>
          </div>
          <Button
            variant="ghost"
            className="bg-foreground hover:bg-blue-80 text-background hover:text-background! dark:hover:bg-blue-30"
            onClick={(e) => onLogin(e)}
          >
            Sign in
          </Button>
          {/* <button className="text-md mb-6 w-full rounded-lg border border-gray-300 p-2 hover:bg-black hover:text-white">
            <img src="google.svg" alt="img" className="mr-2 inline h-6 w-6" />
            Sign in with Google
          </button> */}
          <div className="text-muted pt-5 text-center">
            Don&apos;t have an account?{" "}
            <span
              className="text-foreground cursor-pointer font-bold"
              onClick={() => navigate("/signup")}
            >
              Sign up for free
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

export default Login
