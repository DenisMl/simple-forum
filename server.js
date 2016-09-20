var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session')
var app = express();

//var apiRoutes = require('./routes/apiRoutes');
//var mainRoutes = require('./routes/mainRoutes');
//var apiController = require('./controllers/apiController');

app.set('port', (process.env.PORT || 3000));

//var database = require('./config/database.js');

//mongoose.connect(database.url);

//require('./config/passport')(passport);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'anything' }));
//app.use(passport.initialize());
//app.use(passport.session());


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//app.use('/', mainRoutes);
//app.use('/api', apiRoutes);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});