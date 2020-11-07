var express = require('express');
var config = require('../config');
var common = require('../common/common');
var logger = require('../common/logger');
var router = express.Router();
var conn = require('../db');

var model = {
    result: require('../models/result'),
    boardMaster: require('../models/boardmaster')
};

//마스터목록
router.get('/', function(req, res) {
    var sql = `select masterSeq, boardCategory, boardName, createDate
               from tboardmaster
               order by masterSeq;`;

    var query = conn.query(sql, function(err, results) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            var master = new model.boardMaster(0);
            master.list = results;

            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(master));
            res.json(master);
        }
    });
});

module.exports = router;