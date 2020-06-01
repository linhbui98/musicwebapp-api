const server = require('./socket')
const port = process.env.PORT || 3000

server.listen(port);