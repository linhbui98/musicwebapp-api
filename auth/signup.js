const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const privateKey = require('../config').privateKey
const sendMail = require('../common/email')
const User = require("../models/users.model")

module.exports.signupHandle = async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body
    const user = await User.findOne({ $or:[{ email: email}, {username: username }] })
    // Make sure user doesn't already exist
    if (user && user.email === email) return res.status(200).send({ msg: 'The email address you have entered is already associated with another account.' });
    if (user && user.username === username) return res.status(200).send({ msg: 'The username you have entered is already associated with another account.' });

    // Create and save the user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      email: email,
      password: password,
      fullName: fullName
    });
    newUser.save()

    const token = jwt.sign({id: newUser._id}, privateKey, {expiresIn: '10m'})
    const host = req.get('host')
    const link = "http://" + host + "/verify?id=" + token;
    const subject = "Please confirm your Email account"
    const html = "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    await sendMail(email, subject, html)
    return res.json(newUser);

  } catch (err) {
    return res.json({ msg: err.message })
  }
}
