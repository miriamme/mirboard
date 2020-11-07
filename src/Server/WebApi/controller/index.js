var express = require('express');
var config = require('../config');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('server api connection is OK');
    res.end();
});

//전체 라우터 등록
// for (var name in config.router) {
//     router.use('/' + name, require("./" + config.router[name]));
// }
router.use('/board', require('./board'));
router.use('/boardmaster', require('./boardmaster'));
router.use('/user', require('./user'));

module.exports = router;