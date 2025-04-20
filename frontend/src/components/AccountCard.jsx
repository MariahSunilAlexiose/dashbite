import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { StoreContext } from "@context"
import { CameraIcon, UserIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { getuser, logout } from "@/constants"

const AccountCard = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { setToken, url, userID, token } = useContext(StoreContext)
  const isActive = (path) => location.pathname === path
  const [user, setUser] = useState({})

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("profilePic", file)
        const response = await axios.put(
          `${url}/api/user/update/${userID}/profilePic`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data", token },
          }
        )
        if (!response.data.success) {
          addToast("error", "Error", response.data.message)
          return
        }
        setUser((prevState) => ({
          ...prevState,
          profilePic: response.data.profilePic,
        }))
        addToast("success", "Success", "Profile picture updated successfully!")
      } catch (error) {
        console.error("Failed to upload profile picture:", error)
        addToast("error", "Error", "Failed to upload profile picture!")
      }
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await getuser({ url, userID, token, addToast })
      if (fetchedUser) {
        setUser(fetchedUser)
      }
    }
    fetchUserData()
  }, [token, userID])
  return (
    <div className="bg-blue-30 p-5">
      <div className="relative flex flex-col items-center gap-1">
        <div>
          <div className="h-15 w-15 relative flex shrink-0 items-center justify-center overflow-hidden rounded-full">
            <img
              src={
                user.profilePic &&
                user.profilePic.startsWith("https://ui-avatars.com/api/?name=")
                  ? user.profilePic
                  : `${url}/images/${user.profilePic || UserIcon}`
              }
              alt="User Profile"
              className="aspect-square h-full w-full object-cover"
            />
          </div>
          <div className="bg-foreground hover:bg-gray-20 absolute bottom-7 right-11 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full">
            <input
              id="profilePictureUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureUpload}
            />
            <img
              src={CameraIcon}
              alt="Camera Icon"
              className="h-4 w-4 cursor-pointer"
              onClick={() =>
                document.getElementById("profilePictureUpload").click()
              }
            />
          </div>
        </div>
        <p className="m-0 font-bold">{user.name || ""}</p>
      </div>
      <p
        className={`cursor-pointer ${isActive("/profile") ? "text-primary underline-offset-5 underline" : "hover:text-primary"}`}
        onClick={() => navigate("/profile")}
      >
        My Profile
      </p>
      <p
        className={`mt-3 cursor-pointer ${isActive("/address") ? "text-primary underline-offset-5 underline" : "hover:text-primary"}`}
        onClick={() => navigate("/address")}
      >
        Address
      </p>
      <p
        className={`mt-3 cursor-pointer ${isActive("/myorders") ? "text-primary underline-offset-5 underline" : "hover:text-primary"}`}
        onClick={() => navigate("/myorders")}
      >
        My Order History
      </p>
      <p
        className="hover:text-primary mt-3 cursor-pointer"
        onClick={() => logout({ setToken, navigate })}
      >
        Logout
      </p>
    </div>
  )
}

export default AccountCard
