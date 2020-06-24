const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const indexRouter = require('./routes/index');
const roomsRouter = require('./routes/rooms');
const loginRouter = require('./routes/login');
const registrationRouter = require('./routes/registration');
const app = express();

mongoose.connect('mongodb://localhost:27017/Partyroom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);

app.use((req,res,next) => {
  if(req.session.user) {
    res.locals.login = req.session.user.login
    res.locals.id = req.session.user._id
    return next()
  } else {
    res.redirect('/login')
  }
})

app.use('/rooms', roomsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
