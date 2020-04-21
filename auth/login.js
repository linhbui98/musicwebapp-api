const jwt = require('jsonwebtoken')
// const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const privateKey = require('../config/config').privateKey
const constants = require('../common/constants')
const User = require("../models/users.model")

module.exports.loginHandle = async function(req, res) {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(401).end()
    }
    try {
        console.log("linh")
        const user = await User.findOne({ username: username }, function(err, user) {
            if (err) throw err;
            
            // test a matching password
            user.comparePassword('2321998', function(err, isMatch) {
                if (err) throw err;
                console.log('Password123:', isMatch); // -&gt; Password123: true
            });
        
            // test a failing password
            user.comparePassword('2321998', function(err, isMatch) {
                if (err) throw err;
                console.log('Password123:', isMatch); // -&gt; 123Password: false
            });
        });

        if (!user) {
            throw constants.LOGIN_FAILED
        }

        let userInfo = { ...user }
        let token = jwt.sign(userInfo, privateKey, {expiresIn: '12h'})
        const data = {
            status: 1,
            result: {
                token: token,
                userInfo: userInfo
            }
        }
        res.send(data)
    } catch (error) {
        res.send({status: 2, result: error})
    }
}
