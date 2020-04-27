const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const privateKey = require('../config').privateKey
const constants = require('../common/constants')
const User = require("../models/users.model")

module.exports.loginHandle = async function (req, res) {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(401).end()
    }
    try {
        // const hashPassword = crypto.createHash('sha1').update(password).digest('base64');
        const user = await User.findByCredentials(username, password);

        if (!user) {
            throw constants.LOGIN_FAILED
        }

        // let userInfo = { ...user }
        let token = jwt.sign(userInfo, privateKey, { expiresIn: '12h' })
        const data = {
            status: 1,
            result: {
                token: token,
                userInfo: user
            }
        }
        res.send(data)
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}
