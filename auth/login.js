const jwt = require('jsonwebtoken')
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
        const hashPassword = crypto.createHash('sha1').update(password).digest('base64')
        const user = await User.findOne({ 
            username: username, 
            password: hashPassword, 
            isActive: true 
        })

        if (!user) {
            throw constants.LOGIN_FAILED
        }

        let userInfo = {...user._doc}
        let token = jwt.sign({id: userInfo._id, username: userInfo.username}, privateKey, {expiresIn: '100h'})
        console.log("token", token)
        const data = {
            status: 1,
            result: {
                token: token,
                userInfo: userInfo
            }
        }
        res.send(data)
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}
