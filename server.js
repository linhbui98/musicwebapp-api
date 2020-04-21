const app = require('./app')
const port = process.env.PORT || 3000

console.log(process.env)

app.listen(port, () => console.log(`Server running on port ${port}!`))
