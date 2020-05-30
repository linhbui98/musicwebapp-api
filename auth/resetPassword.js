const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const privateKey = require('../config').privateKey
const sendMail = require('../common/email')
const User = require("../models/users.model")

module.exports.resetPassword = async (req, res) => {
  const { password } = req.body
  const { token } = req.query
  const decoded = jwt.verify(token, privateKey)

  try {
    if (!password) {
      throw new Error('Enter password and confirm password')
    }
    if (password.length < 6) {
      throw new Error('Password min 6 characters')
    }
    if (!decoded.user) {
      throw new Error('Token expired or invalid')
    }

    const email = decoded.user.email

    const user = await User.findOne(
      { email: email }
    )
    user.password = password;
    await user.save()
    return res.json(user);
  } catch (err) {
    return res.json({ msg: err.message, token: token, decoded: decoded })
  }
}
