var express = require('express');
var config = require('../config');
var router = express.Router();
var conn = require('../db');
var server = require('../common/server');
var common = require('../common/common');

var model = {
    result: require('../models/result'),
    board: require('../models/board')
};

//List
router.get('/', function(req, res) {
    server.apiCall(config.endPoint.boardList, "GET", {
        page: typeof req.query.page === "undefined" ? 1 : req.query.page
    }, function(data, params) {
        if (typeof params === "object") {
            data.params = params;
            data.params.html = common.pagination(data.totalCount, 10, params.page, req.baseUrl, "page");
        }
        res.render('list.ejs', data);
    });
});
router.post('/', function(req, res) {
    server.apiCall(config.endPoint.boardList, "GET", {
        keyword: req.body.search,
        page: req.query.page
    }, function(data, params) {
        if (typeof params === "object") {
            data.params = params;
        }
        console.log(data);
        res.render('list.ejs', data);
    });
});

//Write
router.get('/write', function(req, res) {
    server.apiCall(config.endPoint.boardMaster, "GET", null, function(data) {
        res.render('write.ejs', data);
    });
});
router.post('/write', function(req, res) {
    var reqData = {
        "masterSeq": req.body.masterSeq,
        "userId": req.session.userid,
        "title": req.body.ipTitle,
        "content": req.body.txaContent
    };

    server.apiCall(config.endPoint.boardInsert, "POST", reqData, function(data) {
        res.redirect('/board');
    });
});

//Update
router.get('/update/:seq', function(req, res) {
    server.apiCall(config.endPoint.boardList, "GET", req.params.seq, function(data) {
        var viewData = data;
        server.apiCall(config.endPoint.boardMaster, "GET", null, function(categoryData) {
            res.render('update.ejs', {
                view: viewData,
                category: categoryData
            });
        });
    });
});
router.post('/update', function(req, res) {
    var reqData = {
        "masterSeq": req.body.masterSeq,
        "title": req.body.ipTitle,
        "content": req.body.txaContent,
        "seq": req.body.boardSeq
    };

    server.apiCall(config.endPoint.boardUpdate, "POST", reqData, function(data) {
        res.redirect('/board/' + req.body.boardSeq);
    });
});

//Delete
router.get('/delete/:seq', function(req, res) {
    var reqData = {
        "seq": req.params.seq
    };

    server.apiCall(config.endPoint.boardDelete, "POST", reqData, function(data) {
        res.redirect('/board');
    });
});

//View
router.get('/:seq', function(req, res) {
    server.apiCall(config.endPoint.boardList, "GET", req.params.seq, function(data) {
        res.render('view.ejs', data);
    });
});

module.exports = router;