import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers
  if (!token)
    return res.json({ success: false, message: "Not Authorized Login!" })

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.userID = token_decode.id
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.json({
        success: false,
        message: "Token expired! Please log in again.",
      })
    res.json({ success: false, message: "Invalid Token!" })
  }
}

export default authMiddleware
