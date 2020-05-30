var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cors = require('cors')
var config = require('./config').mongodb
var mongoose = require('mongoose')

// database url
var dbUrl = `mongodb://${config.host}:${config.port}/${config.database}`
// auth
var loginHandle = require('./auth/login').loginHandle
var signupHandle = require('./auth/signup').signupHandle
var resendMailVerify = require('./auth/resend').resendMailVerify
var verifyHandle = require('./auth/verify').verifyHandle
var resetPassword = require('./auth/resetPassword').resetPassword
var requestPasswordReset = require('./auth/requestPasswordReset').requestPasswordReset
var auth = require('./auth/auth')

console.log('dbUrl', dbUrl)

// api
var indexRoute = require('./routes/index')
var api = require('./routes/api')

mongoose.connect(
  dbUrl,
  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false},  
  () => console.log('db connected')
)

// var seeder = require('./seed')

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
app.use(express.static(path.join(__dirname, 'uploads')))

app.get('/', indexRoute)
app.post('/login', loginHandle)
app.post('/signup', signupHandle)
app.post('/resend', resendMailVerify)
app.get('/verify', verifyHandle)
app.post('/reset', resetPassword)
app.post('/requestPasswordReset', requestPasswordReset)
app.use('/api', auth, api)
// app.use('/api', api)

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