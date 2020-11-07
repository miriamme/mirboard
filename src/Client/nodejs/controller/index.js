var express = require('express');
var auth = require('../common/auth');
var path = require('path');
var router = express.Router();

router.use(auth.loginCheck);
router.use('/board', require('./board'));
router.use('/master', require('./boardmaster'));
router.use('/user', require('./user'));

router.get('/', function(req, res) {
    res.render('main.ejs');
});

module.exports = router;