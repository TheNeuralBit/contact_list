// MODULES
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('body-parser');
var mongoose       = require('mongoose');

// log all requests
app.use(function(req, res, next) {
  console.log('Request:  ' + req.method + ' ' + req.url);
  next();
  console.log('Response: ' + res.statusCode);
});

// CONFIGURATION
var db = require('./config/db');
var port = process.env.PORT || 8080;

// Uncomment after creating config/db.js
console.log('Connecting mongoose to ' + db.url);
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
console.log(__dirname);
app.use(express.static(__dirname + '/../public'));
require('./app/routes')(app);
app.listen(port);

console.log('Check out port ' + port + '!');

exports = module.expors = app;
