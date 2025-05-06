const adminAuthMiddleware = (req, res, next) => {
  const { token } = req.headers
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "Missing Admin token" })

  if (token !== process.env.ADMIN_TOKEN)
    return res
      .status(403)
      .json({ success: false, message: "Admin access denied" })

  next()
}

export default adminAuthMiddleware
