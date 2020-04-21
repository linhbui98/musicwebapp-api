var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cors = require('cors')
var config = require('./config/config')
var mongoose = require('mongoose')

// database url
var dbUrl = `${config.host}/${config.database}`
// auth
var loginHandle = require('./auth/login').loginHandle
var auth = require('./auth/auth')

// api
var indexRoute = require('./routes/index')
var api = require('./routes/api')
var songController = require('./controllers/songs.controller')

mongoose.connect(
  dbUrl,
  {useNewUrlParser: true, useUnifiedTopology: true}, 
  () => console.log('connected')
)

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', indexRoute)
app.get('/song', songController.findAll)
app.post('/login', loginHandle)
// app.use('/api', auth, api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app