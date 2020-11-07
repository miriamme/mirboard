var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var config = require('./config');
var router = require('./controller/index');
var app = express();

//Server Start
app.listen(config.server.port, function() {
    console.log("Start! express client server on port " + config.server.port);
});

//Middlewere Configuration
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// print the request log on console
app.use(morgan('dev'));
// cookie
app.use(cookieParser('!@#%%@#@'));
// session
app.use(cookieSession({
    name: 'mirboard_session',
    keys: ['userid', 'token'],
    //secret: config.auth.sessionSecret,
    maxAge: 1000 * 60 * 60 //유효기간 1시간
}));

app.set('views', './views');
app.set('view engine', 'ejs');

//Router Register
app.use('/', router);

app.locals._g = {
    site: {
        title: 'MirBoard nodejs Ver.',
        description: 'mirboard description'
    },
    author: {
        name: 'miriamme',
        contact: 'miriamme@gmail.com'
    }
};