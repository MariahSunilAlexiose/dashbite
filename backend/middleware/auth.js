import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login!" })
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userID = token_decode.id
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Token expired! Please log in again.",
      })
    }
    console.error("JWT Verification Error:", error)
    res.json({ success: false, message: "Invalid Token!" })
  }
}

export default authMiddleware
