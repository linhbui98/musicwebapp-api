require('dotenv').config()

const username = process.env.USER_DB
const password = process.env.PW_DB
const database = process.env.DATABASE
const dbPort = process.env.DATABASE_PORT
const dbHost = process.env.HOST_DB
const node_env = process.env.NODE_ENV
const private_key = process.env.PRIVATE_KEY
const hostname = process.env.HOSTNAME
const port = process.env.PORT

const config = {
    dev: {
        mongodb: {
            username,
            password, 
            database,
            host: dbHost,
            port: dbPort
        },
        privateKey: private_key,
        hostname,
        port
    },
    test: {},
    prod: {}
}
module.exports = config[node_env]