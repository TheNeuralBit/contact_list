// MODULES
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('body-parser');

// CONFIGURATION
var db = require('./config/db');
var port = process.env.port || 8080;

// Uncomment after creating config/db.js
//mongose.connect(db.url)

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
