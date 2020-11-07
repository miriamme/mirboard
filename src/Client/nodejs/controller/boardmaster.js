var express = require('express');
var config = require('../config');
var router = express.Router();
var conn = require('../db');
var server = require('../common/server');

var model = {
    result: require('../models/result'),
    boardMaster: require('../models/BoardMaster')
};

router.get('/', function(req, res) {
    server.apiCall(config.endPoint.boardMaster, "GET", null, function(data) {
        res.json(data);
    });
});

module.exports = router;