const redis = require('redis')

const redisClient = redis.createClient()

redisClient.on("connect", () => console.log("Connected to redis!"))
redisClient.on("reconnecting", () => console.log("Reconnecting to redis!"))
redisClient.on("error", (error) => console.log("Error redis: ", error))

module.exports = redisClient