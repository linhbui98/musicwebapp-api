const jwt = require('jsonwebtoken')
const privateKey = require('../config').privateKey
const User = require('../models/users.model');

module.exports.verifyHandle = async (req, res) => {
  try {
    const token = req.query.id
    const decoded = jwt.verify(token, privateKey)
    if (!decoded.id) {
      throw constants.REGISTRATION_LINK_EXPIRED
    }

    const user = await User.findOneAndUpdate(
      { _id: decoded.id },
      { isActive: true }
    );
    
    if(user.isActive === true) {
      return res.json({
        message: 'Email already verified!',
      });
    }

    return res.json({
      message: 'Active account success!',
    });
  } catch (err) {
    res.json(err.message)
  }
}
