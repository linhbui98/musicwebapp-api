const jwt = require('jsonwebtoken')
const privateKey = require('../config/config').privateKey
const constants = require('../common/constants')
const permission = require('./permission')

module.exports = function(req, res, next) {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null
        if (!token) {
            throw constants.AUTHORIZATION_FAILED
        }
        const decoded = jwt.verify(token, privateKey)
        if (!decoded) {
            throw constants.AUTHORIZATION_FAILED
        }
        if (!permission[decoded.Role].includes(req.url.split('?')[0].split('/')[2])) {
            throw constants.PERMISSION_DENY
        }
        req.userId = decoded.ID
        return next()
    } catch(error) {
        return res.send({ status: 2, result: error })
    }
    
}