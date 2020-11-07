var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var router = require('./controller/index');

var app = express();

//Server Start
app.listen(config.server.port, function() {
    console.log("Start! mirboard webapi server on port " + config.server.port);
});

//Middlewere Configuration
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// print the request log on console
app.use(morgan('dev'));

app.set('view engine', 'ejs');

//Router Register
app.use('/', router);