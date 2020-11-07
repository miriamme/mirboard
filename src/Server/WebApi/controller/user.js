var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var common = require('../common/common');
var logger = require('../common/logger');
var router = express.Router();
var conn = require('../db');

//----Model Declear-------------------------------------
var model = {
    result: require('../models/result'),
    user: require('../models/user')
};
//----Model Declear-------------------------------------

//로그인
router.post('/login', function(req, res) {
    var values = [
        req.body.userid,
        req.body.password
    ];

    var sql = "select * from tUser where userId=? and userPassword=?";
    conn.query(sql, values, function(err, result) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            if (result.length === 1) {
                let mResult = new model.result(0);

                console.log(result[0].createDate);

                //jwt processing
                // sign asynchronously
                jwt.sign({
                        userid: values[0],
                        date: result[0].createDate
                    },
                    config.auth.loginKey, {
                        algorithm: 'HS256',
                        expiresIn: '7d',
                        issuer: 'miriamme.com',
                        subject: 'userInfo'
                    },
                    function(err, token) {
                        if (err) console.log(err);
                        else {
                            //console.log(token);
                            mResult.resultMessage = token;
                            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(values) + " | " + JSON.stringify(mResult));
                            res.json(mResult);
                        }
                    });
            } else {
                res.json(new model.result(-2, "It does not exists id or wrong password."));
            }
        }
    });
});

//가입
router.post('/register', function(req, res) {
    var id = req.body.userid;
    var password = req.body.password;
    var createDate = common.getDate();

    //동일유저 체크 후 저장
    var sql, values, query, isExist = false;
    sql = "select * from tUser where userId=?";
    values = req.body.userid;
    query = conn.query(sql, [values], function(err, results) {
        if (err) {
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
            res.json(new model.result(-1, err));
        } else {
            if (results.length === 0) {
                sql = "INSERT INTO tuser (userid, userpassword, createdate) VALUES ?";
                values = [
                    [id, password, createDate]
                ];
                conn.query(sql, [values], function(err, result) {
                    if (err) {
                        logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
                        res.json(new model.result(-1, err));
                    } else {
                        let mResult = new model.result(0);
                        logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(mResult));
                        res.json(mResult);
                    }
                });
            } else {
                let mResult = new model.result(1, "this id exists");
                logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(mResult));
                res.json(mResult);
            }
        }
    });
});
//아이디 검색
router.get('/search', function(req, res) {
    console.log("search keyword : ", req.query.keyword);
    var keyword = req.query.keyword;
    var sql = "select * from tUser where userId=?";
    var query = conn.query(sql, [keyword], function(err, results) {
        if (err) {
            res.json(new model.result(-1, err));
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
        } else {
            var user = new model.user(0);
            if (results.length == 1) {
                user.single = results[0];
            } else if (results.length > 1) {
                user.list = results;
            }
            res.json(user);
            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(user));
        }
    });
});
//한명만 가져오기
router.get('/:seq', function(req, res) {
    var userSeq = req.params.seq;
    var sql = "select * from tUser where userSeq=?";
    var query = conn.query(sql, [userSeq], function(err, results) {
        if (err) {
            res.json(new model.result(-1, err));
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
        } else {
            var user = new model.user();
            if (results.length == 1) {
                user.single = results[0];
            } else {
                user.resultCode = -1;
                user.resultMessage = "Empty data";
            }
            res.json(user);
            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(user));
        }
    });
});
//전체조회
router.get('/', function(req, res) {
    var sql = "select * from tUser order by userSeq asc;";
    var query = conn.query(sql, function(err, results) {
        if (err) {
            res.json(new model.result(-1, err));
            logger.error("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(err));
        } else {
            var user = new model.user();
            user.list = results;
            res.json(user);
            logger.info("[" + req.method + "] " + req.originalUrl + " | " + JSON.stringify(user));
        }
    });
});

module.exports = router;