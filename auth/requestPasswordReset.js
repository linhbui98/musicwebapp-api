const jwt = require('jsonwebtoken')
const privateKey = require('../config').privateKey
const sendMail = require('../common/email')
const User = require("../models/users.model")

module.exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }

    // Set password reset token
    const token = jwt.sign({ user: user }, privateKey, { expiresIn: '24h' })

    // Email user reset link
    const resetLink = `${process.env.FRONTEND_RESETPASSWORD}?token=${token}`
    const html = "Hello,<br> Please Click on the link to reset password.<br><a href=" + resetLink + ">Click here to reset password</a>"
    await sendMail(email, host, html)

    return res.json({
      message: `A link to reset your password has been sent to ${email}`
    })
  } catch (err) {
    return res.json({ msg: err.message })
  }
}
