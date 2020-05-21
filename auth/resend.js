const jwt = require('jsonwebtoken')
const privateKey = require('../config').privateKey
const sendMail = require('../common/email')
const User = require('../models/users.model')

module.exports.resendMailVerify = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email: email })
    if(!user) return res.status(400).send({ msg: 'You have not registerd!' });
    const token = jwt.sign({ id: user._id }, privateKey, { expiresIn: '10m' })
    const host = req.get('host')
    const link = "http://" + host + "/verify?id=" + token;
    const subject = "Please confirm your Email account"
    const html = "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    await sendMail(email, host, html)
    res.json({
      message: 'Resend mail'
    })
  } catch (err) {
    res.json(err.message)
  }
};