var express = require('express');
var config = require('../config');
var common = require('../common/common');
var logger = require('../common/logger');
var router = express.Router();
var conn = require('../db');

var model = {
    result: require('../models/result'),
    board: require('../models/board')
};

//입력
router.post('/add', function(req, res) {
    var values = [
        req.body.masterSeq,
        req.body.userId,
        req.body.title,
        req.body.content,
        0,
        common.getDate()
    ];

    var sql = "INSERT INTO tboard (masterSeq,userId,title,content,deleteYn,createDate) VALUES ?";
    conn.query(sql, [
        [values]
    ], function(err, result) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            let mResult = new model.result(0);
            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(mResult));
            res.json(mResult);
        }
    });
});
//수정
router.post('/update', function(req, res) {
    var values = [
        req.body.masterSeq,
        req.body.title,
        req.body.content,
        common.getDate(),
        req.body.seq
    ];
    var sql = "UPDATE tboard SET masterSeq=?, title=?, content=?, updateDate=? WHERE boardseq=?";
    conn.query(sql, values, function(err, result) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            let mResult = new model.result(0);
            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(mResult));
            res.json(mResult);
        }
    });
});
//삭제
router.post('/delete', function(req, res) {
    var values = [
        common.getDate(),
        req.body.seq
    ];
    var sql = "UPDATE tboard SET deleteYn=1, updateDate=? WHERE boardseq=?";
    conn.query(sql, values, function(err, result) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            let mResult = new model.result(0);
            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(mResult));
            res.json(mResult);
        }
    });
});
//내용
router.get('/:seq', function(req, res) {
    var boardSeq = req.params.seq;
    var sql = `select brd.*, mst.boardCategory, mst.boardName
               from tboard brd left join (tboardmaster mst, tuser usr) 
                               on (brd.masterSeq=mst.masterSeq and brd.userId=usr.userId)
               where brd.boardseq=?`;
    var query = conn.query(sql, [boardSeq], function(err, results) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            var board = new model.board(0);
            board.single = results[0];

            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(board));
            res.json(board);
        }
    });
});
//리스트
router.get('/', function(req, res) {
    var keyword = req.query.keyword;
    var size = 10;
    var page = req.query.page;
    var sql = '';
    if (keyword && keyword !== "") {
        sql = `select count(boardSeq) as totalCount from tboard where deleteYn=0 and title like ?;
               select brd.*, mst.boardCategory, mst.boardName
               from tboard brd left join (tboardmaster mst, tuser usr) 
                               on (brd.masterSeq=mst.masterSeq and brd.userId=usr.userId)
               where brd.deleteYn=0 and brd.title like ?`;
    } else {
        sql = `select count(boardSeq) as totalCount from tboard where deleteYn=0;
               select brd.*, mst.boardCategory, mst.boardName
               from tboard brd left join (tboardmaster mst, tuser usr) 
                               on (brd.masterSeq=mst.masterSeq and brd.userId=usr.userId)
               where brd.deleteYn=0`;
    }

    sql += ' order by brd.boardSeq desc limit ' + size;

    if (parseInt(page)) {
        let p = parseInt(page);
        if (p <= 0) p = 1;
        if (p > 0) sql += ' offset ' + ((p - 1) * size);
    }
    sql += ';';

    var query = conn.query(sql, [keyword + "%", keyword + "%"], function(err, results) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {

            //res.json(results);
            var board = new model.board(0);
            board.totalCount = results[0][0].totalCount;
            board.list = results[1];

            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(board));
            res.json(board);
        }
    });
});

module.exports = router;