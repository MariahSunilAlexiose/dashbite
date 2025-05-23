import React, { useContext, useEffect, useState } from "react"

import { AccountCard, Button, Input, Label } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

import { fetchEndpoint } from "@/constants"

const Profile = () => {
  const { addToast } = useToast()
  const { url, token } = useContext(StoreContext)
  const [user, setUser] = useState({})

  const setUpdates = async (updatedUser) => {
    try {
      if (updatedUser.newPassword !== updatedUser.repeatNewPassword)
        return addToast(
          "error",
          "Error",
          "New password and Repeat New Password do not match!"
        )
      const res = await axios.put(`${url}/api/user/`, updatedUser, {
        headers: { token },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      addToast("success", "Success", "Updated user successfully!")
    } catch (err) {
      console.error("Error updating user:", err)
      addToast("error", "Error", "Failed to update user!")
    }
  }

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value

    const updatedUser = { ...user, [name]: value }
    setUser(updatedUser)
  }

  const fetchUser = async () => {
    try {
      const userData = await fetchEndpoint(url, "user", { token })
      setUser(userData)
    } catch (err) {
      console.error("Error fetching user:", err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [token])

  return (
    <div>
      <h2 className="text-center">My Account</h2>
      <div className="flex-center flex items-center gap-10 p-10">
        <div className="w-1/6">
          <AccountCard />
        </div>
        <div className="flex w-full flex-col gap-5">
          <div className="flex gap-5">
            <div className="w-full">
              <h4>Account Details</h4>
              <div className="py-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  onChange={onChangeHandler}
                  value={user.name || ""}
                  name="name"
                />
              </div>
              <div className="py-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  onChange={onChangeHandler}
                  value={user.email || ""}
                  name="email"
                />
              </div>
            </div>
            <div className="w-full">
              <h4>Password</h4>
              <div className="py-4">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  type="password"
                  onChange={onChangeHandler}
                  value={user.oldPassword || ""}
                  name="oldPassword"
                />
              </div>
              <div className="py-4">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  onChange={onChangeHandler}
                  value={user.newPassword || ""}
                  name="newPassword"
                />
              </div>
              <div className="py-4">
                <Label htmlFor="repeatNewPassword">Repeat New Password</Label>
                <Input
                  type="password"
                  onChange={onChangeHandler}
                  value={user.repeatNewPassword || ""}
                  name="repeatNewPassword"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setUpdates(user)}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
