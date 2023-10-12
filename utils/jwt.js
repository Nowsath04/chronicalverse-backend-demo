const jwt = require("jsonwebtoken")
const createJwt = (res, user) => {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_key, { expiresIn: process.env.JWT_EXPIERD_DATE })
    return res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      }).status(200).json({
            success: true,
            user,
            token
        })
        

}

module.exports = createJwt