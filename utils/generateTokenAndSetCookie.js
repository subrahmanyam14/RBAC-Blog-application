const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign({user_id: user._id}, process.env.SECRET_KEY, { expiresIn: "2d" });
    res.cookie("jwt", token, 
        {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV != "development",
        } 
    )
}

module.exports = generateTokenAndSetCookie;